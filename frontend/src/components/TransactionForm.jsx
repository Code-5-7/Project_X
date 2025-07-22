import { useState, useEffect } from 'react';

function TransactionForm({ userId, onTransactionAdded }) {
    const [formData, setFormData] = useState({ amount: '', category: '', date: '', description: '', goal_id: '' });
    const [message, setMessage] = useState('');
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/goals/${userId}`)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error(err));
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, ...formData, goal_id: formData.goal_id || null })
            });
            const result = await response.json();
            if (response.ok) {
                setMessage(result.flagMessage || result.message);
                setFormData({ amount: '', category: '', date: '', description: '', goal_id: '' });
                if (onTransactionAdded) onTransactionAdded();
            } else {
                setMessage(result.error);
            }
        } catch (error) {
            setMessage('Error adding transaction');
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    placeholder="Amount (positive for income, negative for expense)"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Category (e.g., groceries, gambling)"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <select
                    value={formData.goal_id}
                    onChange={(e) => setFormData({ ...formData, goal_id: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Goal (Optional)</option>
                    {goals.map(goal => (
                        <option key={goal.id} value={goal.id}>{goal.description}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition">
                    Add Transaction
                </button>
            </form>
            {message && (
                <p className={`mt-4 ${message.includes('Warning') || message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default TransactionForm;