import { useState, useEffect } from 'react';
import { deposit, invest, getPortfolio } from './api';
import axios from 'axios';
import Transactions from './Transactions';

function Dashboard({ user }) {
    const [balance, setBalance] = useState(0);
    const [products, setProducts] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [depositAmount, setDepositAmount] = useState('');
    const [investAmount, setInvestAmount] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadPortfolio = async () => {
        try {
            const res = await getPortfolio(user.token);
            setBalance(res.data.balance);
            setPortfolio(res.data.investments);
        } catch (err) {
            console.error(err);
        }
    };

    const loadProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadPortfolio();
        loadProducts();

        // Refresh portfolio every 10 seconds to show live growth
        const interval = setInterval(loadPortfolio, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleDeposit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await deposit(depositAmount, user.token);
            setMessage(res.data.message);
            setBalance(res.data.newBalance);
            setDepositAmount('');
        } catch (err) {
            setError(err.response?.data?.error || 'Deposit failed');
        }
    };

    const handleInvest = async (productId) => {
        setError('');
        setMessage('');
        const amount = investAmount[productId];
        if (!amount) {
            setError('Enter an amount to invest');
            return;
        }
        try {
            const res = await invest(productId, amount, user.token);
            setMessage(res.data.message);
            setBalance(res.data.remainingBalance);
            setInvestAmount({ ...investAmount, [productId]: '' });
            loadPortfolio();
        } catch (err) {
            setError(err.response?.data?.error || 'Investment failed');
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: 20 }}>
            <h2>Welcome, {user.fullName}</h2>
            <h3>Balance: R{Number(balance).toFixed(2)}</h3>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Deposit form */}
            <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 8 }}>
                <h4>Deposit Funds</h4>
                <form onSubmit={handleDeposit} style={{ display: 'flex', gap: 10 }}>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        required
                        style={{ padding: 8, flex: 1 }}
                    />
                    <button type="submit" style={{ padding: '8px 16px' }}>Deposit</button>
                </form>
            </div>

            {/* Products */}
            <div style={{ marginBottom: 20 }}>
                <h4>Available Products</h4>
                {products.map((p) => (
                    <div key={p.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10, borderRadius: 8 }}>
                        <strong>{p.name}</strong> — R{p.price} <br />
                        <small>{p.description}</small> <br />
                        <small>Daily return: {(p.dailyReturnRate * 100).toFixed(2)}%</small>
                        <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
                            <input
                                type="number"
                                placeholder="Amount to invest"
                                value={investAmount[p.id] || ''}
                                onChange={(e) => setInvestAmount({ ...investAmount, [p.id]: e.target.value })}
                                style={{ padding: 6, flex: 1 }}
                            />
                            <button onClick={() => handleInvest(p.id)} style={{ padding: '6px 12px' }}>
                                Invest
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Portfolio */}
            <div>
                <h4>Your Portfolio</h4>
                {portfolio.length === 0 && <p>No investments yet.</p>}
                {portfolio.map((inv) => (
                    <div key={inv.investmentId} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10, borderRadius: 8 }}>
                        <strong>{inv.productName}</strong> <br />
                        Invested: R{Number(inv.amountInvested).toFixed(2)} <br />
                        Current Value: R{Number(inv.currentValue).toFixed(2)} <br />
                        <span style={{ color: inv.profit >= 0 ? 'green' : 'red' }}>
              Profit: R{Number(inv.profit).toFixed(2)}
            </span>
                    </div>
                ))}
            </div>
            <Transactions user={user} />
        </div>
    );
}

export default Dashboard;