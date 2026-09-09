import { useState } from 'react';
import { login } from './api';

function Login({ onSuccess }) {
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
        <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label>Email</label><br />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label>Password</label><br />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: 10, marginTop: 10 }}>
                    Login
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;