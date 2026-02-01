import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Building, Users, Home, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
    const [stats, setStats] = useState({ hostels: 0, bookings: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch owner's hostels and bookings to calc stats
                const hostelsRes = await api.get('/hostels/');
                // TODO: Backend should ideally filter this list for us in a "my-hostels" endpoint, 
                // but our permissions currently return ALL hostels for lists (public view) or we need to filter on client if not staff.
                // WAIT: The HostelViewSet has IsAdminOrOwnerOrReadOnly. 
                // Public GET /hostels list returns ALL. We need a way to get "My Hostels".
                // For now, let's filter client side if the API returns all, or rely on a specific endpoint.
                // Let's assume we filter client side for the count or add a query param '?owner=me'.

                // Temporary: We'll filter client side for stats if the user ID matches, but we don't have user ID readily here without context
                // Let's just create a new endpoint /owner/stats or similar in future. 
                // For MVP, we will rely on fetching bookings (which are already filtered for owners) to get count.

                const bookingsRes = await api.get('/bookings/');
                setStats({
                    hostels: "?", // Placeholder until we fix the list filtering
                    bookings: bookingsRes.data.length
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>Owner Dashboard</h2>

            <div className="grid" style={{ marginBottom: '3rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>My Hostels</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage</div>
                        </div>
                        <Home size={32} color="var(--primary)" />
                    </div>
                </div>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Bookings</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.bookings}</div>
                        </div>
                        <Users size={32} color="var(--primary)" />
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/owner/hostels" className="btn btn-primary">
                        <Home size={18} /> Manage Properties
                    </Link>
                    <Link to="/owner/bookings" className="btn btn-outline">
                        <Users size={18} /> View Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
