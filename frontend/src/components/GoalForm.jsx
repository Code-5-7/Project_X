import { useState } from 'react';

function GoalForm({ userId, onGoalAdded }) {
    const [formData, setFormData] = useState({ target_amount: '', description: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, ...formData })
            });
            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
                setFormData({ target_amount: '', description: '' });
                if (onGoalAdded) onGoalAdded();
            } else {
                setMessage(result.error);
            }
        } catch (error) {
            setMessage('Error adding goal');
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Add Savings Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    placeholder="Target Amount"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Description (e.g., New Car)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition">
                    Add Goal
                </button>
            </form>
            {message && (
                <p className={`mt-4 ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default GoalForm;