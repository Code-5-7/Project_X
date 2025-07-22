import { FaChartBar, FaMoneyBillWave, FaBullseye } from 'react-icons/fa';

function Sidebar({ activeSection, setActiveSection, setUser }) {
    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-6">Finance Tracker</h2>
            <nav className="space-y-2">
                <button
                    onClick={() => setActiveSection('dashboard')}
                    className={`flex items-center w-full p-2 rounded ${activeSection === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'} transition`}
                >
                    <FaChartBar className="mr-2" /> Dashboard
                </button>
                <button
                    onClick={() => setActiveSection('transactions')}
                    className={`flex items-center w-full p-2 rounded ${activeSection === 'transactions' ? 'bg-blue-600' : 'hover:bg-gray-700'} transition`}
                >
                    <FaMoneyBillWave className="mr-2" /> Transactions
                </button>
                <button
                    onClick={() => setActiveSection('goals')}
                    className={`flex items-center w-full p-2 rounded ${activeSection === 'goals' ? 'bg-blue-600' : 'hover:bg-gray-700'} transition`}
                >
                    <FaBullseye className="mr-2" /> Goals
                </button>
                <button
                    onClick={() => setUser(null)}
                    className="flex items-center w-full p-2 rounded hover:bg-red-600 transition"
                >
                    <FaChartBar className="mr-2" /> Logout
                </button>
            </nav>
        </div>
    );
}

export default Sidebar;