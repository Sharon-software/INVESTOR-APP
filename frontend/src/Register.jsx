import { useState } from 'react';
import { register } from './api';

function Register({ onSuccess }) {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        dateOfBirth: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setVerificationCode('');

        try {
            const response = await register(form);
            setMessage(response.data.message);
            if (response.data.verificationCode) {
                setVerificationCode(response.data.verificationCode);
            }
        } catch (err) {
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'object') {
                    const errors = Object.values(data).join(', ');
                    setError(errors);
                } else {
                    setError(data);
                }
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label>Full Name</label><br />
                    <input name="fullName" value={form.fullName} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Email</label><br />
                    <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Phone Number</label><br />
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Password</label><br />
                    <input type="password" name="password" value={form.password} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
                    <small>Must be 8+ characters, with uppercase, lowercase, number, and special character</small>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Date of Birth</label><br />
                    <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: 10, marginTop: 10 }}>Register</button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {verificationCode && (
                <p style={{ background: '#eef', padding: 10 }}>
                    Demo verification code: <strong>{verificationCode}</strong>
                </p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {message && (
                <button onClick={onSuccess} style={{ marginTop: 10 }}>
                    Continue to Login
                </button>
            )}
        </div>
    );
}

export default Register;