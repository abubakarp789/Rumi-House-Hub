import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleRoute from './components/RoleRoute';

// Layout Wrappers
import PublicLayout from './components/PublicLayout';
import AppShell from './components/AppShell';

// Page Views
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Societies from './pages/Societies';
import SocietyDetail from './pages/SocietyDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import News from './pages/News';
import Dashboard from './pages/Dashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Access Coordinates */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/societies" element={<Societies />} />
            <Route path="/societies/:id" element={<SocietyDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/forbidden" element={<Forbidden />} />
            
            {/* Fallback 404 Pages */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Secured Authenticated Dashboard Panels */}
          <Route element={<AppShell />}>
            <Route 
              path="/dashboard" 
              element={
                <RoleRoute allowedRoles={['student']}>
                  <Dashboard />
                </RoleRoute>
              } 
            />

            <Route 
              path="/executive" 
              element={
                <RoleRoute allowedRoles={['executive']}>
                  <ExecutiveDashboard />
                </RoleRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
