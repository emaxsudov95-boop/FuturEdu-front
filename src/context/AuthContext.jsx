import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const getToken = () => localStorage.getItem('futuredu_token') || localStorage.getItem('bilimdon_token');
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  // Foydalanuvchini yuklash
  const loadUser = async () => {
    const savedToken = getToken();
    if (savedToken) {
      try {
        const res = await authAPI.getMe();
        if (res.data?.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn("Token yaroqsiz yoki server o'chiq:", err.message);
        localStorage.removeItem('futuredu_token');
        localStorage.removeItem('bilimdon_token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data?.token) {
      localStorage.setItem('futuredu_token', res.data.token);
      localStorage.setItem('bilimdon_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    if (res.data?.token) {
      localStorage.setItem('futuredu_token', res.data.token);
      localStorage.setItem('bilimdon_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('futuredu_token');
    localStorage.removeItem('bilimdon_token');
    setToken(null);
    setUser(null);
  };

  // Coin yoki XP o'zgarganda kontekstni darhol yangilash
  const updateUserStats = (newCoins, newXp, newLevel, newCareer) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...(newCoins !== undefined && { coins: newCoins }),
        ...(newXp !== undefined && { xp: newXp }),
        ...(newLevel !== undefined && { level: newLevel }),
        ...(newCareer !== undefined && { selectedCareer: newCareer })
      };
    });
  };

  const refreshUser = async () => {
    if (token) {
      await loadUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserStats,
        refreshUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
