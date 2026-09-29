import { useState } from 'react';
import { login } from './api';
import './Auth.css';

function Login({ onSuccess, onNavigate }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(form);
            // Save token + user info so the rest of the app can use it
            onSuccess(response.data);
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="login-title">
                <span className="auth-eyebrow">WELCOME BACK</span>
                <h1 className="auth-title" id="login-title">Log in to InvestorApp</h1>
                <p className="auth-description">Sign in to continue building your investment journey.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <button className="auth-submit" type="submit">Log in</button>
                </form>
                <p className="auth-switch">
                    Don’t have an account?{' '}
                    <button className="auth-link" type="button" onClick={() => onNavigate('register')}>
                        Create account
                    </button>
                </p>
            </section>
        </main>
    );
}

export default Login;