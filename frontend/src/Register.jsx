import { useState } from 'react';
import { register } from './api';
import './Auth.css';

function Register({ onSuccess, onNavigate }) {
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
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="register-title">
                <span className="auth-eyebrow">START YOUR INVESTMENT JOURNEY</span>
                <h1 className="auth-title" id="register-title">Create your account</h1>
                <p className="auth-description">A few details are all you need to get started.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="register-full-name">Full name</label>
                        <input id="register-full-name" name="fullName" value={form.fullName} onChange={handleChange} autoComplete="name" required />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="register-email">Email</label>
                        <input id="register-email" type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="register-phone">Phone number</label>
                        <input id="register-phone" type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} autoComplete="tel" required />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="register-password">Password</label>
                        <input id="register-password" type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" required />
                        <small>Use at least 8 characters with uppercase, lowercase, a number, and a special character.</small>
                    </div>
                    <div className="auth-field">
                        <label htmlFor="register-date-of-birth">Date of birth</label>
                        <input id="register-date-of-birth" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} autoComplete="bday" required />
                    </div>
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <button className="auth-submit" type="submit">Create account</button>
                </form>

                {message && <p className="auth-message" role="status">{message}</p>}
                {verificationCode && (
                    <p className="auth-verification">
                        Demo verification code: <strong>{verificationCode}</strong>
                    </p>
                )}
                {message && (
                    <p className="auth-switch">
                        <button className="auth-link" type="button" onClick={onSuccess}>
                            Continue to log in
                        </button>
                    </p>
                )}
                <p className="auth-switch">
                    Already have an account?{' '}
                    <button className="auth-link" type="button" onClick={() => onNavigate('login')}>
                        Log in
                    </button>
                </p>
            </section>
        </main>
    );
}

export default Register;