import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiTeacherModal from './components/AiTeacherModal';

// O'quvchi Sahifalari
import Home from './pages/Home';
import CareerGuide from './pages/CareerGuide';
import Quizzes from './pages/Quizzes';
import QACommunity from './pages/QACommunity';
import Leaderboard from './pages/Leaderboard';
import RewardShop from './pages/RewardShop';
import AiTutorChat from './pages/AiTutorChat';
import CareerChat from './pages/CareerChat';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import MockTest from './pages/MockTest';
import BattleArena from './pages/BattleArena';

// Admin Sahifalari
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminAssignments from './pages/admin/AdminAssignments';
import AdminCareers from './pages/admin/AdminCareers';
import AdminRewards from './pages/admin/AdminRewards';
import AdminPayments from './pages/admin/AdminPayments';
import AdminModeration from './pages/admin/AdminModeration';
import AdminAiControl from './pages/admin/AdminAiControl';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminMockSettings from './pages/admin/AdminMockSettings';

// Ota-ona Sahifalari
import ParentLayout from './pages/parent/ParentLayout';
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentTasks from './pages/parent/ParentTasks';
import ParentAiAdvice from './pages/parent/ParentAiAdvice';
import ParentReports from './pages/parent/ParentReports';
import ParentPremium from './pages/parent/ParentPremium';
import ParentLogin from './pages/parent/ParentLogin';
import ParentRegister from './pages/parent/ParentRegister';

// AppWrapper: Agar admin yoki ota-onalar paneli bo'lsa o'quvchi Navbari va Footeri yashiriladi
const AppWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isParentRoute = location.pathname.startsWith('/parent');
  const hideStudentChrome = isAdminRoute || isParentRoute;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* O'quvchi Navbari (Admin yoki Parent bo'lmaganda) */}
      {!hideStudentChrome && <Navbar />}

      {/* Asosiy Marshrutlar */}
      <main className="flex-1">
        <Routes>
          {/* O'quvchi platformasi */}
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<CareerGuide />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/qa" element={<QACommunity />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rewards" element={<RewardShop />} />
          <Route path="/chat" element={<CareerChat />} />
          <Route path="/mock" element={<MockTest />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/battle" element={<BattleArena />} />
          <Route path="/arena" element={<BattleArena />} />
          <Route path="/ai-tutor" element={<AiTutorChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Panel Marshrutlari */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="mock-settings" element={<AdminMockSettings />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="rewards" element={<AdminRewards />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="moderation" element={<AdminModeration />} />
            <Route path="ai-control" element={<AdminAiControl />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>

          {/* Ota-onalar Paneli Marshrutlari */}
          <Route path="/parent/login" element={<ParentLogin />} />
          <Route path="/parent/register" element={<ParentRegister />} />
          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<ParentDashboard />} />
            <Route path="tasks" element={<ParentTasks />} />
            <Route path="ai-advice" element={<ParentAiAdvice />} />
            <Route path="reports" element={<ParentReports />} />
            <Route path="premium" element={<ParentPremium />} />
          </Route>
        </Routes>
      </main>

      {/* Floating AI Ustoz faqat o'quvchi qismida bo'ladi */}
      {!hideStudentChrome && <AiTeacherModal />}

      {/* O'quvchi Footeri */}
      {!hideStudentChrome && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
