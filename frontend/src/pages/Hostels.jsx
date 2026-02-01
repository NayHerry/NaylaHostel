import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MapPin, ArrowRight, Star, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hostels = () => {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await api.get('/hostels/');
                setHostels(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchHostels();
    }, []);

    if (loading) return <div className="container">Loading hostels...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} className="gradient-text">Discover Your Stay</h2>
                <p style={{ color: 'var(--text-muted)' }}>Browse our curated selection of premium hostels in Zanzibar.</p>
            </header>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {hostels.map(hostel => (
                    <div
                        key={hostel.id}
                        className="glass card"
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                        }}
                        onClick={() => navigate(`/hostels/${hostel.id}`)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ width: '100%', height: '220px', position: 'relative' }}>
                            <img
                                src={hostel.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'}
                                alt={hostel.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.7)',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <Star size={12} fill="gold" color="gold" /> 4.8
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{hostel.name}</h3>
                                <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                    TZS {Number(hostel.price_per_month).toLocaleString()}
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                                <MapPin size={14} /> {hostel.location}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                {hostel.services?.split(',').slice(0, 3).map((service, i) => (
                                    <span key={i} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                        {service.trim()}
                                    </span>
                                ))}
                                {hostel.services?.split(',').length > 3 && (
                                    <span style={{ fontSize: '0.75rem', padding: '2px 8px' }}>+more</span>
                                )}
                            </div>

                            <button className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                View Details <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hostels;
