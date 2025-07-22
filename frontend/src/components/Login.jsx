import { useState } from 'react';

function Login({ setUser }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegister ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                if (!isRegister) setUser({ userId: result.userId });
                setMessage(result.message);
            } else {
                setMessage(result.error);
            }
        } catch (error) {
            setMessage('Error connecting to server');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border border-gray-600 bg-gray-700 text-gray-100 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition">
                    {isRegister ? 'Register' : 'Login'}
                </button>
            </form>
            <button
                onClick={() => setIsRegister(!isRegister)}
                className="mt-4 text-blue-400 hover:text-blue-300 transition"
            >
                {isRegister ? 'Switch to Login' : 'Switch to Register'}
            </button>
            {message && (
                <p className={`mt-4 ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default Login;