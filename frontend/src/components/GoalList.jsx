import { useState, useEffect } from 'react';

function GoalList({ userId }) {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/goals/${userId}`)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error(err));
    }, [userId]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Savings Goals</h2>
            {goals.length === 0 ? (
                <p className="text-gray-400">No goals yet.</p>
            ) : (
                <ul className="space-y-4">
                    {goals.map(goal => (
                        <li key={goal.id} className="p-4 border border-gray-600 rounded-lg bg-gray-700">
                            <p><strong>Description:</strong> {goal.description || 'N/A'}</p>
                            <p><strong>Target:</strong> ${goal.target_amount}</p>
                            <p><strong>Current:</strong> ${goal.current_amount}</p>
                            <div className="w-full bg-gray-600 rounded-full h-4 mt-2">
                                <div
                                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-sm mt-1 text-gray-300">
                                {Math.round((goal.current_amount / goal.target_amount) * 100)}% Complete
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GoalList;