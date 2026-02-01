import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/bookings/${id}/`, { status });
            fetchBookings();
        } catch (err) {
            alert('Failed to update booking');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this booking?')) {
            try {
                await api.delete(`/bookings/${id}/`);
                fetchBookings();
            } catch (err) {
                alert('Failed to delete booking');
            }
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem' }}>
                <h2>All Bookings</h2>
                <p style={{ color: 'var(--text-muted)' }}>Review and manage student reservations.</p>
            </header>

            <div className="glass" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                            <th style={{ padding: '1rem' }}>Student</th>
                            <th style={{ padding: '1rem' }}>Hostel</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                <td style={{ padding: '1rem' }}>{booking.student_name}</td>
                                <td style={{ padding: '1rem' }}>{booking.hostel_name}</td>
                                <td style={{ padding: '1rem' }}>{new Date(booking.booking_date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                        color: booking.status === 'CONFIRMED' ? 'var(--success)' : '#fbbf24'
                                    }}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    {booking.status === 'PENDING' && (
                                        <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--success)' }} onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}>
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                    <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--error)' }} onClick={() => handleDelete(booking.id)}>
                                        <XCircle size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
