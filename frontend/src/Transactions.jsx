import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Transactions({ user }) {
    const [transactions, setTransactions] = useState([]);
    const [type, setType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const buildParams = () => {
        const params = {};
        if (type) params.type = type;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return params;
    };

    const loadTransactions = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/transactions', {
                headers: { Authorization: `Bearer ${user.token}` },
                params: buildParams(),
            });
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const handleExport = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/transactions/export', {
                headers: { Authorization: `Bearer ${user.token}` },
                params: buildParams(),
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="transaction-panel" aria-labelledby="transaction-title">
            <h2 id="transaction-title">Transaction history</h2>

            <div className="transaction-filters">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">All types</option>
                    <option value="deposit">Deposit</option>
                    <option value="investment">Investment</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="income">Income</option>
                </select>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className="dashboard-button" onClick={loadTransactions}>Filter</button>
                <button className="dashboard-button" onClick={handleExport}>Export CSV</button>
            </div>

            <div className="transaction-table-wrap">
            <table className="transaction-table">
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((t) => (
                    <tr key={t.id}>
                        <td>{t.type}</td>
                        <td className={t.amount >= 0 ? 'transaction-positive' : 'transaction-negative'}>
                            R{Number(t.amount).toFixed(2)}
                        </td>
                        <td>{new Date(t.date).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            {transactions.length === 0 && <p>No transactions found.</p>}
        </section>
    );
}

export default Transactions;