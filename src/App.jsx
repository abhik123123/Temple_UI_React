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
// Temporarily hidden features
// import Bajanas from './pages/Bajanas';
// import BajanasAdmin from './pages/BajanasAdmin';
// import PoojaBooks from './pages/PoojaBooks';
// import PoojaAdmin from './pages/PoojaAdmin';
import Staff from './pages/Staff';
import StaffAdmin from './pages/StaffAdmin';
import Timings from './pages/Timings';
import TimingsAdmin from './pages/TimingsAdmin';
import Donors from './pages/Donors';
import BoardMembers from './pages/BoardMembers';
import SubscriptionAdmin from './components/SubscriptionAdmin';
import DonorsAdmin from './pages/DonorsAdmin';
import DailyPrayers from './pages/DailyPrayers';
import DailyPrayersAdmin from './pages/DailyPrayersAdmin';
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
        {/* <Route path="/bajanas" element={<Bajanas />} /> */}
        {/* <Route path="/pooja-books" element={<PoojaBooks />} /> */}
        <Route path="/staff" element={<Staff />} />
        <Route path="/timings" element={<Timings />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/board-members" element={<BoardMembers />} />
        <Route path="/daily-prayers" element={<DailyPrayers />} />

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
        {/* <Route path="/bajanas/admin" element={
          <ProtectedRoute requireAdmin>
            <BajanasAdmin />
          </ProtectedRoute>
        } /> */}
        {/* <Route path="/pooja-books/admin" element={
          <ProtectedRoute requireAdmin>
            <PoojaAdmin />
          </ProtectedRoute>
        } /> */}
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
        {/* Board Members - Integrated admin/user view, redirect admin route to main page */}
        <Route path="/board-members/admin" element={<Navigate to="/board-members" replace />} />
        <Route path="/donors/admin" element={
          <ProtectedRoute requireAdmin>
            <DonorsAdmin />
          </ProtectedRoute>
        } />
        <Route path="/subscriptions/admin" element={
          <ProtectedRoute requireAdmin>
            <SubscriptionAdmin />
          </ProtectedRoute>
        } />
        <Route path="/daily-prayers/admin" element={
          <ProtectedRoute requireAdmin>
            <DailyPrayersAdmin />
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
