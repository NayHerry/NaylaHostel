import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Building, BookMarked, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ hostels: 0, bookings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const hostels = await api.get('/hostels/');
                const bookings = await api.get('/bookings/');
                setStats({
                    hostels: hostels.data.length,
                    bookings: bookings.data.length
                });
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Admin Control Center</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Manage Zanzibar's student hostel ecosystem.</p>
            </header>

            <div className="grid">
                <Link to="/admin/hostels" className="glass card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Building size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3>{stats.hostels} Hostels</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Add new hostels, update room availability, or change pricing.</p>
                </Link>

                <Link to="/admin/bookings" className="glass card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <BookMarked size={40} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                    <h3>{stats.bookings} Bookings</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Review all student bookings and confirm room allocations.</p>
                </Link>

                <div className="glass card">
                    <ShieldCheck size={40} color="var(--success)" style={{ marginBottom: '1rem' }} />
                    <h3>System Status</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>API Backend: Online<br />Database: Connected</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
