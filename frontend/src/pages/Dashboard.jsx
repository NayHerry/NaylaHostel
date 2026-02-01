import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            if (user.is_staff) {
                navigate('/admin');
            } else if (user.role === 'OWNER') {
                navigate('/owner');
            } else {
                // Students land on Browse Hostels or their own simple dashboard
                // For now, let's redirect to browse hostels as that's the main action
                navigate('/hostels');
            }
        }
    }, [user, loading, navigate]);

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
            <p>Redirecting to your dashboard...</p>
        </div>
    );
};

export default Dashboard;
