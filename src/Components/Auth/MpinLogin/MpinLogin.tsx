import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import bg from '../../../Assets/Login.jpg';
import icon from '../../../Assets/favicon1.png';
import PinPad from '../PinPad/PinPad';
import { verifyMpin, clearMpin } from '../../../Services/mpinUtils';

const MpinLogin: React.FC = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');

    const handleVerify = async (currentPin: string) => {
        if (checking) return;
        setChecking(true);
        const valid = await verifyMpin(currentPin);
        if (valid) {
            navigate('/home/dashBoard', { replace: true });
        } else {
            const next = attempts + 1;
            setAttempts(next);
            setError(true);
            setPin('');
            setTimeout(() => {
                setError(false);
                setChecking(false);
            }, 600);
        }
    };

    // Auto-submit when 4 digits are entered
    useEffect(() => {
        if (pin.length === 4) handleVerify(pin);
        // eslint-disable-next-line
    }, [pin]);

    const handleForgotMpin = () => {
        clearMpin();
        navigate('/', { replace: true });
        toast.info('MPIN cleared. Login again to set a new one.');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-screen h-screen relative overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] to-[#0d1b4b]">
                <img
                    className="hidden md:block w-full h-full object-cover opacity-60"
                    src={bg}
                    alt=""
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex items-center justify-center md:justify-end md:pr-24">
                <div className="flex flex-col items-center gap-7 w-full max-w-xs px-6">

                    {/* Avatar & greeting */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden">
                            <img src={icon} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-white/60 text-sm">Welcome back</p>
                        <p className="text-white text-xl font-semibold tracking-wide">
                            {userDetails.name || 'User'}
                        </p>
                    </motion.div>

                    {/* Title */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-white/70 text-sm"
                    >
                        Enter your 4-digit MPIN
                    </motion.p>

                    {/* Wrong attempts warning */}
                    {attempts >= 3 && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-yellow-400 text-xs text-center bg-yellow-400/10 px-4 py-2 rounded-lg"
                        >
                            {attempts} incorrect {attempts === 1 ? 'attempt' : 'attempts'}. Forgot your PIN?
                        </motion.p>
                    )}

                    {/* Pin Pad */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <PinPad
                            pin={pin}
                            onDigit={(d) => setPin(p => p + d)}
                            onDelete={() => setPin(p => p.slice(0, -1))}
                            error={error}
                        />
                    </motion.div>

                    {/* Forgot MPIN */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        onClick={handleForgotMpin}
                        className="text-white/40 text-xs hover:text-white/70 transition-colors underline underline-offset-2 mt-1"
                    >
                        Forgot MPIN?
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default MpinLogin;
