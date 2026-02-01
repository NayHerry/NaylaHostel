import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Hostels from './pages/Hostels';
import HostelDetails from './pages/HostelDetails';
import MyBooking from './pages/MyBooking';
import AdminDashboard from './pages/AdminDashboard';
import AdminHostels from './pages/AdminHostels';
import AdminBookings from './pages/AdminBookings';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerHostels from './pages/OwnerHostels';
import OwnerBookings from './pages/OwnerBookings';

const ProtectedRoute = ({ children, adminOnly = false, ownerOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.is_staff) return <Navigate to="/dashboard" />;
  if (ownerOnly && user.role !== 'OWNER' && !user.is_staff) return <Navigate to="/dashboard" />; // Staff can also access owner view if needed or strictly owner
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />

              {/* Owner Routes */}
              <Route path="/owner" element={
                <ProtectedRoute ownerOnly><OwnerDashboard /></ProtectedRoute>
              } />
              <Route path="/owner/hostels" element={
                <ProtectedRoute ownerOnly><OwnerHostels /></ProtectedRoute>
              } />
              <Route path="/owner/bookings" element={
                <ProtectedRoute ownerOnly><OwnerBookings /></ProtectedRoute>
              } />

              <Route path="/hostels" element={
                <ProtectedRoute><Hostels /></ProtectedRoute>
              } />
              <Route path="/my-booking" element={
                <ProtectedRoute><MyBooking /></ProtectedRoute>
              } />

              <Route path="/hostels/:id" element={
                <ProtectedRoute><HostelDetails /></ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/hostels" element={
                <ProtectedRoute adminOnly><AdminHostels /></ProtectedRoute>
              } />
              <Route path="/admin/hostels/:id" element={
                <ProtectedRoute adminOnly><HostelDetails /></ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>
              } />

              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
