import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Wifi, CheckCircle, Calendar, ArrowLeft, Shield, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const HostelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingAmount, setBookingAmount] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hasBooking, setHasBooking] = useState(false);

    useEffect(() => {
        const fetchHostel = async () => {
            try {
                const res = await api.get(`/hostels/${id}/`);
                setHostel(res.data);
            } catch (err) {
                console.error("Failed to fetch hostel details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHostel();

        // Check if user already has a booking
        const checkBooking = async () => {
            if (user && !user.is_staff && user.role !== 'OWNER') {
                try {
                    await api.get('/bookings/my/');
                    setHasBooking(true);
                } catch (err) {
                    setHasBooking(false);
                }
            }
        };
        checkBooking();
    }, [id, user]);

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bookings/', {
                hostel: hostel.id,
                start_date: startDate,
                end_date: endDate
            });
            alert('Booking Request Sent Successfully! Check My Booking.');
            navigate('/my-booking');
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.non_field_errors?.[0] ||
                err.response?.data?.hostel?.[0] ||
                'Booking failed. You might already have a booking or the hostel is full.';
            alert(errorMsg);
        }
    };

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>Loading...</div>;
    if (!hostel) return <div className="container">Hostel not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingBottom: '4rem' }}
        >
            {/* Hero Section */}
            <div style={{
                height: '50vh',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0 0 24px 24px',
                background: `url(${hostel.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%', paddingBottom: '3rem', color: 'white' }}>
                    <button
                        onClick={() => navigate(user?.is_staff ? '/admin/hostels' : '/hostels')}
                        className="btn"
                        style={{ position: 'absolute', top: '-15rem', left: '0', background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)' }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>{hostel.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.9 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> {hostel.university_name}, {hostel.location}</span>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

                {/* Left Column: Details */}
                <div>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Overview</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-body)' }}>
                            Welcome to {hostel.name}, a premium student accommodation designed for comfort and productivity.
                            Situated in {hostel.location}, it offers easy access to {hostel.university_name} and nearby amenities.
                        </p>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Amenities</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                            {hostel.services?.split(',').map((service, idx) => (
                                <div key={idx} style={{
                                    padding: '1rem',
                                    background: 'var(--surface-container)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    fontWeight: '500'
                                }}>
                                    <CheckCircle size={18} color="var(--success)" />
                                    <span>{service.trim()}</span>
                                </div>
                            )) || (
                                    <>
                                        <div style={{ padding: '1rem', background: 'var(--surface-container)', borderRadius: '12px', display: 'flex', gap: '0.8rem' }}><Wifi size={18} /> WiFi</div>
                                        <div style={{ padding: '1rem', background: 'var(--surface-container)', borderRadius: '12px', display: 'flex', gap: '0.8rem' }}><Shield size={18} /> Security</div>
                                        <div style={{ padding: '1rem', background: 'var(--surface-container)', borderRadius: '12px', display: 'flex', gap: '0.8rem' }}><Coffee size={18} /> Common Area</div>
                                    </>
                                )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking/Admin Card */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Price per month</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>TZS {Number(hostel.price_per_month).toLocaleString()}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Availability</span>
                                <span style={{ fontWeight: 'bold', color: hostel.available_rooms > 0 ? 'var(--success)' : 'var(--error)' }}>
                                    {hostel.available_rooms} / {hostel.total_rooms} rooms
                                </span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--surface-variant)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(hostel.available_rooms / hostel.total_rooms) * 100}%`,
                                    background: hostel.available_rooms > 0 ? 'var(--primary)' : 'var(--error)',
                                    height: '100%'
                                }} />
                            </div>
                        </div>

                        {user?.is_staff || (user?.role === 'OWNER') ? (
                            <div style={{ padding: '1rem', background: 'var(--surface-container)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>You are viewing this as Admin/Owner.</p>
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>To edit, go back to the dashboard management.</p>
                            </div>
                        ) : hasBooking ? (
                            <div style={{ padding: '2rem', background: 'var(--surface-container)', borderRadius: '12px', textAlign: 'center' }}>
                                <CheckCircle size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>Active Booking Found</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    You already have a reserved room. You can only book one hostel at a time.
                                </p>
                                <button
                                    className="btn btn-outline"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => navigate('/my-booking')}
                                >
                                    View My Booking
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleBook}>
                                <div className="input-group">
                                    <label>Move-in Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Move-out Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                                    disabled={hostel.available_rooms === 0}
                                >
                                    {hostel.available_rooms > 0 ? 'Request Booking' : 'Fully Booked'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default HostelDetails;
