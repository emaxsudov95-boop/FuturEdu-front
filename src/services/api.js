import axios from 'axios';

const isViteDev = typeof window !== 'undefined' && window.location.port === '5173';
const defaultProdBackend = 'https://futuredu-backend-production.up.railway.app';
const backendUrl = import.meta.env?.VITE_BACKEND_URL || (isViteDev ? 'http://localhost:5000' : defaultProdBackend);
const API = axios.create({
  baseURL: backendUrl ? (backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`) : `${defaultProdBackend}/api`,
  headers: {
    'Content-Type': 'application/json',
    'x-admin-key': 'bilimdon-admin-secure-2026'
  },
});

// Har bir so'rovga JWT token va Ota-ona ma'lumotlarini avtomatik qo'shish
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('futuredu_token') || localStorage.getItem('bilimdon_token');
  const parentToken = localStorage.getItem('parent_token');
  const parentUser = localStorage.getItem('parent_user');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (parentToken) {
    config.headers['x-parent-token'] = parentToken;
  }
  if (parentUser) {
    try {
      const parsed = JSON.parse(parentUser);
      if (parsed.id) config.headers['x-parent-id'] = parsed.id;
    } catch {}
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Careers API
export const careerAPI = {
  getAll: () => API.get('/careers'),
  getBySlug: (slug) => API.get(`/careers/${slug}`),
  selectCareer: (careerTitle) => API.post('/careers/select', { careerTitle }),
};

// Quizzes API
export const quizAPI = {
  getAll: (subject) => API.get('/quizzes', { params: { subject } }),
  getById: (id) => API.get(`/quizzes/${id}`),
  submit: (id, answers) => API.post(`/quizzes/${id}/submit`, { answers }),
};

// Questions (Q&A) API
export const questionAPI = {
  getAll: (subject) => API.get('/questions', { params: { subject } }),
  create: (data) => API.post('/questions', data),
  addAnswer: (id, content) => API.post(`/questions/${id}/answers`, { content }),
  like: (id) => API.post(`/questions/${id}/like`),
};

// Rewards API
export const rewardAPI = {
  getAll: () => API.get('/rewards'),
  purchase: (id) => API.post(`/rewards/${id}/purchase`),
};

// AI Tutor API
export const aiAPI = {
  chat: (message, context) => API.post('/ai/chat', { message, context }),
};

// User API
export const userAPI = {
  getLeaderboard: () => API.get('/users/leaderboard'),
  updateProfile: (data) => API.put('/users/profile', data),
};

// Public Notifications & Assignments
export const publicAPI = {
  getNotifications: () => API.get('/notifications'),
  getAssignments: () => API.get('/assignments'),
};

// ================= ADMIN API =================
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getStudents: (params) => API.get('/admin/students', { params }),
  toggleBlockStudent: (id) => API.post(`/admin/students/${id}/toggle-block`),
  adjustCoins: (id, amount, reason) => API.post(`/admin/students/${id}/adjust-coins`, { amount, reason }),
  warnStudent: (id, reason) => API.post(`/admin/students/${id}/warn`, { reason }),
  createQuiz: (data) => API.post('/admin/quizzes', data),
  updateQuiz: (id, data) => API.put(`/admin/quizzes/${id}`, data),
  deleteQuiz: (id) => API.delete(`/admin/quizzes/${id}`),
  getAssignments: () => API.get('/admin/assignments'),
  createAssignment: (data) => API.post('/admin/assignments', data),
  deleteAssignment: (id) => API.delete(`/admin/assignments/${id}`),
  createCareer: (data) => API.post('/admin/careers', data),
  deleteCareer: (id) => API.delete(`/admin/careers/${id}`),
  createReward: (data) => API.post('/admin/rewards', data),
  deleteReward: (id) => API.delete(`/admin/rewards/${id}`),
  getPayments: () => API.get('/admin/payments'),
  updatePaymentStatus: (id, status) => API.post(`/admin/payments/${id}/status`, { status }),
  getModeration: () => API.get('/admin/moderation'),
  deleteModerationItem: (id) => API.delete(`/admin/moderation/${id}`),
  getNotifications: () => API.get('/admin/notifications'),
  sendNotification: (data) => API.post('/admin/notifications', data),
  getAuditLogs: () => API.get('/admin/audit-logs'),
  getAiStats: () => API.get('/admin/ai/stats'),
  updateAiSettings: (data) => API.put('/admin/ai/settings', data),
};

// ================= PARENT API =================
export const parentAPI = {
  register: (data) => API.post('/parent/auth/register', data),
  login: (data) => API.post('/parent/auth/login', data),
  getMe: () => API.get('/parent/auth/me'),
  getChildren: () => API.get('/parent/children'),
  addChild: (data) => API.post('/parent/children/add', data),
  getChildDashboard: (childId) => API.get(`/parent/dashboard/${childId}`),
  getParentAiAdvice: (childId) => API.get(`/parent/ai-advice/${childId}`),
  getParentNotifications: () => API.get('/parent/notifications'),
  updateSubscription: (data) => API.post('/parent/subscription', data),
  getReportData: (childId, period) => API.get(`/parent/report/${childId}`, { params: { period } }),
};

// ================= KASB CHATI API =================
export const chatAPI = {
  getCareerChat: (careerSlug) => API.get(`/chat/messages/${careerSlug}`),
  sendMessage: (careerSlug, data) => API.post(`/chat/messages/${careerSlug}`, data),
  getAllRoomsAdmin: () => API.get('/chat/admin/all-rooms'),
  deleteMessage: (messageId) => API.delete(`/chat/admin/messages/${messageId}`),
};

// ================= MOK TEST API =================
export const mockAPI = {
  getInfo: () => API.get('/mock/info'),
  startTest: (payload) => API.post('/mock/start', typeof payload === 'string' ? { subjectId: payload } : payload),
  submitTest: (data) => API.post('/mock/submit', data),
  getMyHistory: () => API.get('/mock/history'),
  getAdminSettings: () => API.get('/mock/admin/settings'),
  updateAdminSettings: (data) => API.put('/mock/admin/settings', data),
};

// ================= BATTLE (BILIM JANGI) API =================
export const battleAPI = {
  getProfile: () => API.get('/battle/profile'),
  findMatch: (careerSlug) => API.post('/battle/match', { careerSlug }),
  submitBattle: (data) => API.post('/battle/submit', data),
  getHistory: () => API.get('/battle/history'),
  getLeaderboard: () => API.get('/battle/leaderboard'),
};

export default API;
