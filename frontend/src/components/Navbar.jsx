 import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Building, BookMarked, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--primary)' }}>
                NAYLA HOSTEL
            </Link>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {/* Admin Links */}
                {user.is_staff && (
                    <>
                        <Link to="/admin" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Dashboard</Link>
                        <Link to="/admin/hostels" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Hostels</Link>
                        <Link to="/admin/bookings" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Bookings</Link>
                    </>
                )}

                {/* Owner Links */}
                {!user.is_staff && user.role === 'OWNER' && (
                    <>
                        <Link to="/owner" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Dashboard</Link>
                        <Link to="/owner/hostels" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>My Properties</Link>
                        <Link to="/owner/bookings" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>My Guests</Link>
                    </>
                )}

                {/* Student Links */}
                {!user.is_staff && user.role !== 'OWNER' && (
                    <>
                        <Link to="/hostels" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Browse Hostels</Link>
                        <Link to="/my-booking" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>My Booking</Link>
                    </>
                )}

                <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--error)' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
