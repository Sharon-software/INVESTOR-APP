import { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div style={{ border: '1px solid #ccc', padding: 15, marginTop: 20, borderRadius: 8 }}>
            <h4>Transaction History</h4>

            <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">All types</option>
                    <option value="deposit">Deposit</option>
                    <option value="investment">Investment</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="income">Income</option>
                </select>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button onClick={loadTransactions}>Filter</button>
                <button onClick={handleExport}>Export CSV</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td>{t.type}</td>
                        <td style={{ color: t.amount >= 0 ? 'green' : 'red' }}>
                            R{Number(t.amount).toFixed(2)}
                        </td>
                        <td>{new Date(t.date).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {transactions.length === 0 && <p>No transactions found.</p>}
        </div>
    );
}

export default Transactions;