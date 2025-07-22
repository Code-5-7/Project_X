import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Login from './components/Login';
import GoalForm from './components/GoalForm';
import GoalList from './components/GoalList';
import SummaryChart from './components/SummaryChart';
import Sidebar from './components/Sidebar';

function App() {
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('dashboard');

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Login setUser={setUser} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex font-inter">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} setUser={setUser} />
            <div className="flex-1 p-6 ml-64">
                <h1 className="text-3xl font-bold mb-6">Personal Finance Tracker</h1>
                {activeSection === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SummaryChart userId={user.userId} />
                        <GoalList userId={user.userId} />
                    </div>
                )}
                {activeSection === 'transactions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TransactionForm userId={user.userId} />
                        <TransactionList userId={user.userId} />
                    </div>
                )}
                {activeSection === 'goals' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GoalForm userId={user.userId} />
                        <GoalList userId={user.userId} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;