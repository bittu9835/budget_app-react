import React, { useState, useContext } from 'react';
import { FaUser, FaCog, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { DataContext } from '../../../Context/DataProvider';
import PinPad from '../../Auth/PinPad/PinPad';
import {
    isMpinSet,
    saveMpin,
    verifyMpin,
    clearMpin,
} from '../../../Services/mpinUtils';

// ─── MPIN Section ─────────────────────────────────────────────────────────────

type MpinView = 'idle' | 'setup-create' | 'setup-confirm' | 'change-verify' | 'change-create' | 'change-confirm';

function MpinSection() {
    const [view, setView] = useState<MpinView>('idle');
    const [pin, setPin] = useState('');
    const [firstPin, setFirstPin] = useState('');
    const [error, setError] = useState(false);
    const [mpinEnabled, setMpinEnabled] = useState(isMpinSet());
    const reset = () => {
        setPin('');
        setFirstPin('');
        setView('idle');
        setError(false);
    };

    const showError = (cb?: () => void) => {
        setError(true);
        setPin('');
        setTimeout(() => {
            setError(false);
            cb?.();
        }, 600);
    };

    const handleSubmit = async (currentPin: string) => {
        switch (view) {
            // ── Setup flow ──
            case 'setup-create':
                setFirstPin(currentPin);
                setPin('');
                setView('setup-confirm');
                break;
            case 'setup-confirm':
                if (currentPin === firstPin) {
                    await saveMpin(currentPin);
                    setMpinEnabled(true);
                    toast.success('MPIN enabled');
                    reset();
                } else {
                    showError(() => {
                        setView('setup-create');
                        setFirstPin('');
                    });
                }
                break;

            // ── Change flow ──
            case 'change-verify': {
                const valid = await verifyMpin(currentPin);
                if (valid) {
                    setPin('');
                    setView('change-create');
                } else {
                    showError();
                }
                break;
            }
            case 'change-create':
                setFirstPin(currentPin);
                setPin('');
                setView('change-confirm');
                break;
            case 'change-confirm':
                if (currentPin === firstPin) {
                    await saveMpin(currentPin);
                    toast.success('MPIN updated');
                    reset();
                } else {
                    showError(() => {
                        setView('change-create');
                        setFirstPin('');
                    });
                }
                break;
        }
    };

    // Auto-submit on 4 digits
    React.useEffect(() => {
        if (pin.length === 4) handleSubmit(pin);
        // eslint-disable-next-line
    }, [pin]);

    const handleRemoveMpin = () => {
        clearMpin();
        setMpinEnabled(false);
        toast.success('MPIN removed');
        reset();
    };

    // ── Idle state (no active pin-entry) ──
    if (view === 'idle') {
        return (
            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Security</h3>

                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-800">MPIN Login</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {mpinEnabled
                                    ? 'Quick 4-digit PIN is active'
                                    : 'Enable quick 4-digit PIN access'}
                            </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${mpinEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {mpinEnabled ? 'ON' : 'OFF'}
                        </span>
                    </div>

                    {mpinEnabled ? (
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => { setPin(''); setView('change-verify'); }}
                                className="flex-1 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Change MPIN
                            </button>
                            <button
                                onClick={handleRemoveMpin}
                                className="flex-1 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                            >
                                Remove MPIN
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setPin(''); setView('setup-create'); }}
                            className="w-full py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Set up MPIN
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Active PIN entry ──
    const labels: Record<MpinView, { title: string; sub: string }> = {
        idle: { title: '', sub: '' },
        'setup-create':   { title: 'Create MPIN',          sub: 'Enter a new 4-digit PIN' },
        'setup-confirm':  { title: 'Confirm MPIN',         sub: 'Re-enter to confirm' },
        'change-verify':  { title: 'Verify current MPIN',  sub: 'Enter your existing PIN' },
        'change-create':  { title: 'New MPIN',             sub: 'Enter your new PIN' },
        'change-confirm': { title: 'Confirm new MPIN',     sub: 'Re-enter new PIN to confirm' },
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Security</h3>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col items-center gap-6 py-4"
                >
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">{labels[view].title}</p>
                        <p className="text-xs text-gray-500 mt-1">{labels[view].sub}</p>
                    </div>

                    {/* Inline pin dots — dark-themed pad inside settings white card */}
                    <div className="bg-gray-800 rounded-2xl px-8 py-6 w-full max-w-xs">
                        <div className="[&_button]:text-gray-200 [&_.border-white\\/70]:border-gray-400">
                            <PinPad
                                pin={pin}
                                onDigit={(d) => setPin(p => p + d)}
                                onDelete={() => setPin(p => p.slice(0, -1))}
                                error={error}
                            />
                        </div>
                    </div>

                    <button
                        onClick={reset}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
                    >
                        Cancel
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ─── Main Settings ────────────────────────────────────────────────────────────

function Settings() {
    const [activeSection, setActiveSection] = useState('profile');
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    const { theme, setTheme } = useContext(DataContext);

    const settingsSections = [
        { id: 'profile',  name: 'Profile',  icon: <FaUser className="w-4 h-4" /> },
        { id: 'general',  name: 'General',  icon: <FaCog className="w-4 h-4" /> },
        { id: 'security', name: 'Security', icon: <FaShieldAlt className="w-4 h-4" /> },
    ];

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Profile Information</h3>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                disabled
                                value={userDetails.name || ''}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                disabled
                                value={userDetails.email || ''}
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                            />
                        </div>
                    </div>
                );

            case 'general':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">General Settings</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Dark Mode</p>
                                <p className="text-xs text-gray-500">Switch between light and dark theme</p>
                            </div>
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                );

            case 'security':
                return <MpinSection />;

            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="w-full md:w-52 bg-white rounded-lg shadow">
                            <nav className="space-y-1 p-4">
                                {settingsSections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {section.icon}
                                        <span>{section.name}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 bg-white rounded-lg shadow p-6 overflow-y-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {renderSectionContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
