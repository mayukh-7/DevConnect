import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
// Import Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
// Import State and Layout
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';
import { useNotificationStore } from './store/useNotificationStore.js';
import Layout from './components/layout/Layout.jsx'; 

function App() {
  const { authUser,checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { getNotifications } = useNotificationStore(); 
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  useEffect(() => {
    if (authUser) {
      getNotifications();
    }
  }, [authUser, getNotifications]);

  
  return (
    <div data-theme={theme} className="min-h-screen">
      <BrowserRouter>
        <Routes>
          {/* Protected Routes: Wrap in Layout */}
          <Route
            path="/"
            element={authUser ? <Layout><FeedPage /></Layout> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <Layout><ProfilePage /></Layout> : <Navigate to="/login" />}
          />

          {/* Guest Routes */}
          <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

          {/* Add other protected routes (notifications, etc.) here */}
          <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;