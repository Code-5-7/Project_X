import { useState, useEffect } from 'react';

function TransactionList({ userId, onTransactionUpdated }) {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [goals, setGoals] = useState([]);

    const fetchTransactions = () => {
        fetch(`http://localhost:5000/api/transactions/${userId}`)
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchTransactions();
        fetch(`http://localhost:5000/api/goals/${userId}`)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error(err));
    }, [userId]);

    const handleEdit = (transaction) => {
        setEditingTransaction({ ...transaction });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/transactions/${editingTransaction.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, ...editingTransaction, goal_id: editingTransaction.goal_id || null })
            });
            const result = await response.json();
            if (response.ok) {
                fetchTransactions();
                setEditingTransaction(null);
                if (onTransactionUpdated) onTransactionUpdated();
            }
        } catch (error) {
            console.error('Error updating transaction');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchTransactions();
                if (onTransactionUpdated) onTransactionUpdated();
            }
        } catch (error) {
            console.error('Error deleting transaction');
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Transactions</h2>
            {transactions.length === 0 ? (
                <p className="text-gray-400">No transactions yet.</p>
            ) : (
                <ul className="space-y-4">
                    {transactions.map(transaction => (
                        <li
                            key={transaction.id}
                            className={`p-4 border border-gray-600 rounded-lg ${transaction.is_flagged ? 'bg-red-900/50' : 'bg-gray-700'}`}
                        >
                            {editingTransaction && editingTransaction.id === transaction.id ? (
                                <form onSubmit={handleUpdate} className="space-y-2">
                                    <input
                                        type="number"
                                        value={editingTransaction.amount}
                                        onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                                        className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={editingTransaction.category}
                                        onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                                        className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={editingTransaction.goal_id || ''}
                                        onChange={(e) => setEditingTransaction({ ...editingTransaction, goal_id: e.target.value })}
                                        className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Goal (Optional)</option>
                                        {goals.map(goal => (
                                            <option key={goal.id} value={goal.id}>{goal.description}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        value={editingTransaction.date}
                                        onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                                        className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        value={editingTransaction.description || ''}
                                        onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                                        className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex space-x-2">
                                        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingTransaction(null)}
                                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p><strong>Amount:</strong> ${transaction.amount}</p>
                                    <p><strong>Category:</strong> {transaction.category}</p>
                                    <p><strong>Goal:</strong> {transaction.goal_description || 'None'}</p>
                                    <p><strong>Date:</strong> {transaction.date}</p>
                                    <p><strong>Description:</strong> {transaction.description || 'N/A'}</p>
                                    {transaction.is_flagged && (
                                        <p className="text-red-400 font-semibold">Flagged: Risky category</p>
                                    )}
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={() => handleEdit(transaction)}
                                            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TransactionList;