import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, Clock, MapPin, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBooking = () => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get('/bookings/my/');
                setBooking(res.data);
            } catch (err) {
                // 404 means no booking
                setBooking(null);
            }
            setLoading(false);
        };
        fetchBooking();
    }, []);

    const handleCancel = async () => {
        if (!booking) return;
        if (window.confirm('Are you sure you want to cancel your booking?')) {
            try {
                await api.delete(`/bookings/${booking.id}/`);
                setBooking(null);
                alert('Booking cancelled successfully.');
            } catch (err) {
                alert('Failed to cancel booking.');
            }
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>My Booking Status</h2>

            {!booking ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface-container)', borderRadius: '16px' }}>
                    <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <h3>No Active Booking</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't booked any hostel yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/hostels')}>
                        Browse Hostels
                    </button>
                </div>
            ) : (
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Status Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '2rem',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid var(--outline-variant)'
                    }}>
                        <div>
                            <h3 style={{ margin: 0 }}>{booking.hostel_name}</h3>
                            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                {booking.hostel_location && <><MapPin size={14} /> {booking.hostel_location}</>}
                            </div>
                        </div>
                        <div style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            background: booking.status === 'CONFIRMED' ? 'var(--success)' : 'var(--surface-variant)',
                            color: booking.status === 'CONFIRMED' ? 'white' : 'var(--text-body)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            {booking.status === 'CONFIRMED' ? <CheckCircle size={16} /> : <Clock size={16} />}
                            {booking.status}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Check-in Date</label>
                            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{booking.start_date || 'Not specified'}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Check-out Date</label>
                            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{booking.end_date || 'Not specified'}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Student Name</label>
                            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{booking.student_name}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Booking Reference</label>
                            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>#{booking.id.toString().padStart(6, '0')}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--outline-variant)' }}>
                        <button className="btn btn-outline" style={{ color: 'var(--error)', borderColor: 'var(--error)' }} onClick={handleCancel}>
                            Cancel Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBooking;
