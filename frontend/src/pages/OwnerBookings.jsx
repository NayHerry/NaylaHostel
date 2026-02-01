import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, XCircle, Trash2, Undo2 } from 'lucide-react';

const OwnerBookings = () => {
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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/bookings/${id}/`, { status: newStatus });
            fetchBookings();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to PERMANENTLY delete this booking? This action cannot be undone.')) {
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
            <h2 style={{ marginBottom: '2rem' }}>My Guests</h2>

            <div className="glass" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                            <th style={{ padding: '1rem' }}>Student</th>
                            <th style={{ padding: '1rem' }}>Hostel</th>
                            <th style={{ padding: '1rem' }}>Dates</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No bookings found.
                                </td>
                            </tr>
                        ) : bookings.map(booking => (
                            <tr key={booking.id} style={{ borderBottom: '1px solid var(--surface-variant)' }}>
                                <td style={{ padding: '1rem' }}><strong>{booking.student_name}</strong></td>
                                <td style={{ padding: '1rem' }}>{booking.hostel_name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem' }}>{booking.start_date || 'N/A'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>to {booking.end_date || 'N/A'}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background: booking.status === 'CONFIRMED' ? 'var(--success)' :
                                            booking.status === 'PENDING' ? 'var(--outline-variant)' : 'var(--error)',
                                        color: 'white'
                                    }}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    {booking.status === 'PENDING' ? (
                                        <>
                                            <button
                                                className="btn"
                                                style={{ padding: '0.4rem', background: 'var(--success)', color: 'white' }}
                                                onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                                title="Confirm Booking"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                            <button
                                                className="btn"
                                                style={{ padding: '0.4rem', background: 'var(--error)', color: 'white' }}
                                                onClick={() => handleDelete(booking.id)}
                                                title="Reject & Delete"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
                                                onClick={() => handleStatusUpdate(booking.id, 'PENDING')}
                                                title="Unconfirm (Revert to Pending)"
                                            >
                                                <Undo2 size={16} />
                                            </button>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', color: 'var(--error)' }}
                                                onClick={() => handleDelete(booking.id)}
                                                title="Delete Booking"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnerBookings;
