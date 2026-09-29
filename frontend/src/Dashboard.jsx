import { useState, useEffect } from 'react';
import { deposit, withdraw, invest, getPortfolio } from './api';
import axios from 'axios';
import Transactions from './Transactions';
import './Dashboard.css';

function Dashboard({ user }) {
    const [balance, setBalance] = useState(0);
    const [products, setProducts] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [investAmount, setInvestAmount] = useState({});
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        if (!notice) return undefined;

        const timeout = setTimeout(() => setNotice(null), 5000);
        return () => clearTimeout(timeout);
    }, [notice]);

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
        try {
            const res = await deposit(depositAmount, user.token);
            setNotice({
                type: 'success',
                title: 'Deposit successful',
                message: res.data.message || 'Your funds have been added.',
            });
            setBalance(res.data.newBalance);
            setDepositAmount('');
        } catch (err) {
            setNotice({
                type: 'error',
                title: 'Deposit failed',
                message: err.response?.data?.error || 'Please try again.',
            });
        }
    };

    const handleWithdrawal = async (e) => {
        e.preventDefault();
        const amount = Number(withdrawalAmount);
        if (!amount || amount <= 0) {
            setNotice({ type: 'error', title: 'Withdrawal not processed', message: 'Enter a valid amount to withdraw.' });
            return;
        }
        if (amount > Number(balance)) {
            setNotice({
                type: 'error',
                title: 'Insufficient balance',
                message: `You can withdraw up to R${Number(balance).toFixed(2)}.`,
            });
            return;
        }

        try {
            const res = await withdraw(amount, user.token);
            setNotice({
                type: 'success',
                title: 'Withdrawal successful',
                message: res.data.message || 'Your withdrawal has been processed.',
            });
            setBalance(res.data.newBalance);
            setWithdrawalAmount('');
        } catch (err) {
            setNotice({
                type: 'error',
                title: 'Withdrawal failed',
                message: err.response?.data?.error || 'Please try again.',
            });
        }
    };

    const handleInvest = async (productId) => {
        const amount = Number(investAmount[productId]);
        const product = products.find((item) => item.id === productId);
        if (!amount || amount <= 0) {
            setNotice({ type: 'error', title: 'Investment not placed', message: 'Enter a valid amount to invest.' });
            return;
        }
        if (product && amount < Number(product.price)) {
            setNotice({
                type: 'error',
                title: 'Investment amount too low',
                message: `The minimum investment for ${product.name} is R${Number(product.price).toFixed(2)}.`,
            });
            return;
        }
        try {
            const res = await invest(productId, amount, user.token);
            setNotice({
                type: 'success',
                title: 'Investment successful',
                message: res.data.message || `Your investment in ${product?.name || 'this product'} was placed.`,
            });
            setBalance(res.data.remainingBalance);
            setInvestAmount({ ...investAmount, [productId]: '' });
            loadPortfolio();
        } catch (err) {
            setNotice({
                type: 'error',
                title: 'Investment failed',
                message: err.response?.data?.error || 'Please try again.',
            });
        }
    };

    return (
        <main className="dashboard-page">
            {notice && (
                <div className={`dashboard-toast dashboard-toast-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'} aria-live={notice.type === 'error' ? 'assertive' : 'polite'}>
                    <span className="dashboard-toast-icon" aria-hidden="true">{notice.type === 'success' ? '✓' : '!'}</span>
                    <div>
                        <strong>{notice.title}</strong>
                        <p>{notice.message}</p>
                    </div>
                    <button
                        className="dashboard-toast-dismiss"
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={() => setNotice(null)}
                    >
                        ×
                    </button>
                </div>
            )}
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div>
                        <span className="dashboard-eyebrow">INVESTORAPP</span>
                        <h1 className="dashboard-welcome">Welcome, {user.fullName}</h1>
                    </div>
                    <div className="dashboard-balance" aria-label={`Balance: R${Number(balance).toFixed(2)}`}>
                        <span>Available balance</span>
                        <strong>R{Number(balance).toFixed(2)}</strong>
                    </div>
                </header>

                <section className="dashboard-panel" aria-labelledby="portfolio-title">
                    <div className="dashboard-section-heading">
                        <div>
                            <span className="dashboard-eyebrow">YOUR INVESTMENTS</span>
                            <h2 id="portfolio-title">Portfolio</h2>
                        </div>
                    </div>
                    {portfolio.length === 0 ? (
                        <p className="dashboard-empty">No investments yet. Choose an option below to get started.</p>
                    ) : (
                        <div className="portfolio-grid">
                            {portfolio.map((inv) => (
                                <article className="portfolio-card" key={inv.investmentId}>
                                    <h3>{inv.productName}</h3>
                                    <p>Invested <strong>R{Number(inv.amountInvested).toFixed(2)}</strong></p>
                                    <p>Current value <strong>R{Number(inv.currentValue).toFixed(2)}</strong></p>
                                    <p className={inv.profit >= 0 ? 'portfolio-profit' : 'portfolio-loss'}>
                                        Profit <strong>R{Number(inv.profit).toFixed(2)}</strong>
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <div className="dashboard-fund-grid">
                    <section className="dashboard-panel" aria-labelledby="deposit-title">
                        <h2 id="deposit-title">Deposit funds</h2>
                        <form onSubmit={handleDeposit} className="dashboard-deposit-form">
                            <input
                                type="number"
                                placeholder="Amount"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                required
                                min="0.01"
                                step="0.01"
                                aria-label="Deposit amount"
                            />
                            <button className="dashboard-button" type="submit">Deposit</button>
                        </form>
                    </section>

                    <section className="dashboard-panel" aria-labelledby="withdrawal-title">
                        <h2 id="withdrawal-title">Withdraw funds</h2>
                        <form onSubmit={handleWithdrawal} className="dashboard-deposit-form">
                            <input
                                type="number"
                                placeholder="Amount"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(e.target.value)}
                                required
                                min="0.01"
                                max={balance}
                                step="0.01"
                                aria-label="Withdrawal amount"
                            />
                            <button className="dashboard-button" type="submit">Withdraw</button>
                        </form>
                        <p className="dashboard-available-note">Available to withdraw: R{Number(balance).toFixed(2)}</p>
                    </section>
                </div>

                <section className="dashboard-products" id="available-products" aria-labelledby="products-title">
                    <div className="dashboard-section-heading">
                        <div>
                            <span className="dashboard-eyebrow">GROW YOUR PORTFOLIO</span>
                            <h2 id="products-title">Available investments</h2>
                        </div>
                    </div>
                    {products.map((p) => (
                        <article className="dashboard-product-card" key={p.id}>
                            <div className="dashboard-product-info">
                                <h3>{p.name}</h3>
                                <p>{p.description}</p>
                                <span>Price R{p.price} <i>·</i> Daily return {(p.dailyReturnRate * 100).toFixed(2)}%</span>
                            </div>
                            <div className="dashboard-invest-form">
                                <input
                                    type="number"
                                    placeholder="Amount to invest"
                                    value={investAmount[p.id] || ''}
                                    onChange={(e) => setInvestAmount({ ...investAmount, [p.id]: e.target.value })}
                                    min="0.01"
                                    step="0.01"
                                    aria-label={`Amount to invest in ${p.name}`}
                                />
                                <button className="dashboard-button" onClick={() => handleInvest(p.id)}>
                                    Invest
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
                <Transactions user={user} />
            </div>
        </main>
    );
}

export default Dashboard;