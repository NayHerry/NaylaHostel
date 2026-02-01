import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit2, X, Image as ImageIcon, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHostels = () => {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Edit Mode State
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', university_name: '', location: '', total_rooms: '', available_rooms: '', price_per_month: '',
        image_url: '', services: ''
    });

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            const res = await api.get('/hostels/');
            setHostels(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleEdit = (hostel) => {
        setFormData({
            name: hostel.name,
            university_name: hostel.university_name,
            location: hostel.location,
            total_rooms: hostel.total_rooms,
            available_rooms: hostel.available_rooms,
            price_per_month: hostel.price_per_month,
            image_url: hostel.image_url || '',
            services: hostel.services || ''
        });
        setEditingId(hostel.id);
        setEditMode(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '', university_name: '', location: '', total_rooms: '', available_rooms: '', price_per_month: '',
            image_url: '', services: ''
        });
        setEditMode(false);
        setEditingId(null);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode && editingId) {
                await api.put(`/hostels/${editingId}/`, formData);
            } else {
                await api.post('/hostels/', formData);
            }
            resetForm();
            fetchHostels();
        } catch (err) {
            alert(editMode ? 'Failed to update hostel' : 'Failed to add hostel');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hostel?')) {
            try {
                await api.delete(`/hostels/${id}/`);
                fetchHostels();
            } catch (err) {
                alert('Failed to delete hostel');
            }
        }
    };

    // Helper to handle room input changes safely
    const handleRoomChange = (e) => {
        const val = e.target.value;
        // If simply typing total rooms in create mode, sync available rooms
        // In edit mode, we might want to be more careful, but for this demo keeping it simple:
        // Updating total rooms updates available rooms if user manually triggered it? 
        // Let's keep the original logic: changing total_rooms updates available_rooms for simplicity,
        // but user might need to be careful.
        setFormData({ ...formData, total_rooms: val, available_rooms: val });
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Nayla System</h2>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus size={18} /> New Hostel
                </button>
            </div>

            <div className="glass" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                            <th style={{ padding: '1rem' }}>Hostel Info</th>
                            <th style={{ padding: '1rem' }}>Location</th>
                            <th style={{ padding: '1rem' }}>Rooms Info</th>
                            <th style={{ padding: '1rem' }}>Price / Mo</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hostels.map(hostel => (
                            <tr key={hostel.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                        {hostel.image_url ? (
                                            <img src={hostel.image_url} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={20} /></div>
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{hostel.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hostel.university_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{hostel.location}</td>
                                <td style={{ padding: '1rem' }}>{hostel.available_rooms} / {hostel.total_rooms}</td>
                                <td style={{ padding: '1rem' }}>TZS {Number(hostel.price_per_month).toLocaleString()}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--text-main)' }} onClick={() => navigate(`/admin/hostels/${hostel.id}`)} title="View Details">
                                        <Eye size={16} />
                                    </button>
                                    <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => handleEdit(hostel)} title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--error)' }} onClick={() => handleDelete(hostel.id)} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <form className="glass card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3>{editMode ? 'Edit Property' : 'Add New Property'}</h3>
                            <button type="button" onClick={resetForm} style={{ background: 'none', border: 'none', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>Hostel Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>University</label>
                                <input type="text" value={formData.university_name} onChange={(e) => setFormData({ ...formData, university_name: e.target.value })} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Location / Address</label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                        </div>

                        <div className="input-group">
                            <label>Image URL</label>
                            <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                        </div>

                        <div className="input-group">
                            <label>Services (WiFi, AC, Laundry...)</label>
                            <input type="text" value={formData.services} onChange={(e) => setFormData({ ...formData, services: e.target.value })} placeholder="Service1, Service2, Service3" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>Total Rooms</label>
                                <input type="number" value={formData.total_rooms} onChange={handleRoomChange} required />
                            </div>
                            <div className="input-group">
                                <label>Price / Month</label>
                                <input type="number" value={formData.price_per_month} onChange={(e) => setFormData({ ...formData, price_per_month: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Available</label>
                                <input type="number" value={formData.available_rooms} onChange={(e) => setFormData({ ...formData, available_rooms: e.target.value })} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            {editMode ? 'Update Property' : 'Create Property'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminHostels;
