
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import IndiaTime from './components/IndiaTime';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import AdminDashboard from './pages/AdminDashboard';
import EventsUser from './pages/EventsUser';
import EventsAdmin from './pages/EventsAdmin';
import Services from './pages/Services';
import ServicesAdmin from './pages/ServicesAdmin';
import Staff from './pages/Staff';
import StaffAdmin from './pages/StaffAdmin';
import Timings from './pages/Timings';
import TimingsAdmin from './pages/TimingsAdmin';
import Donors from './pages/Donors';
import BoardMembers from './pages/BoardMembers';
import BoardMembersAdmin from './pages/BoardMembersAdmin';
import SubscriptionAdmin from './components/SubscriptionAdmin';
import './styles/App.css';

function AppRoutes() {
  return (
    <>
      <Navigation />
      <Routes>
        {/* Public Routes - No authentication required */}
        <Route path="/login" element={<Login />} />
        
        {/* User Routes - Redirect / to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/events" element={<EventsUser />} />
        <Route path="/services" element={<Services />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/timings" element={<Timings />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/board-members" element={<BoardMembers />} />

        {/* ADMIN ROUTES - Authentication and admin role required */}
        <Route path="/home/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminHome />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminHome />
          </ProtectedRoute>
        } />
        <Route path="/events/admin" element={
          <ProtectedRoute requireAdmin>
            <EventsAdmin />
          </ProtectedRoute>
        } />
        <Route path="/services/admin" element={
          <ProtectedRoute requireAdmin>
            <ServicesAdmin />
          </ProtectedRoute>
        } />
        <Route path="/staff/admin" element={
          <ProtectedRoute requireAdmin>
            <StaffAdmin />
          </ProtectedRoute>
        } />
        <Route path="/timings/admin" element={
          <ProtectedRoute requireAdmin>
            <TimingsAdmin />
          </ProtectedRoute>
        } />
        <Route path="/board-members/admin" element={
          <ProtectedRoute requireAdmin>
            <BoardMembersAdmin />
          </ProtectedRoute>
        } />
        <Route path="/subscriptions/admin" element={
          <ProtectedRoute requireAdmin>
            <SubscriptionAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <IndiaTime />
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
