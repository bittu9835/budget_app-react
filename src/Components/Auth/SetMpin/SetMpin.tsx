import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import bg from '../../../Assets/Login.jpg';
import icon from '../../../Assets/favicon1.png';
import PinPad from '../PinPad/PinPad';
import { saveMpin } from '../../../Services/mpinUtils';

type Step = 'create' | 'confirm';

const SetMpin: React.FC = () => {
    const [step, setStep] = useState<Step>('create');
    const [pin, setPin] = useState('');
    const [firstPin, setFirstPin] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleConfirm = async (currentPin: string) => {
        if (step === 'create') {
            setFirstPin(currentPin);
            setPin('');
            setStep('confirm');
        } else {
            if (currentPin === firstPin) {
                await saveMpin(currentPin);
                toast.success('MPIN set! App is now protected.');
                navigate('/home/dashBoard', { replace: true });
            } else {
                setError(true);
                setPin('');
                setTimeout(() => {
                    setError(false);
                    setStep('create');
                    setFirstPin('');
                }, 700);
            }
        }
    };

    // Auto-submit when 4 digits entered
    useEffect(() => {
        if (pin.length === 4) handleConfirm(pin);
        // eslint-disable-next-line
    }, [pin]);

    const stepLabels: Record<Step, { title: string; sub: string }> = {
        create: {
            title: 'Set your MPIN',
            sub: 'Create a 4-digit PIN for quick access',
        },
        confirm: {
            title: 'Confirm MPIN',
            sub: 'Re-enter your PIN to confirm',
        },
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

                    {/* Icon */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 overflow-hidden"
                    >
                        <img src={icon} alt="" className="w-full h-full object-cover" />
                    </motion.div>

                    {/* Title — animates between steps */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-center"
                        >
                            <p className="text-white text-xl font-semibold">{stepLabels[step].title}</p>
                            <p className="text-white/60 text-sm mt-1">{stepLabels[step].sub}</p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Step indicator */}
                    <div className="flex gap-2">
                        <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 'create' ? 'bg-white' : 'bg-white/30'}`} />
                        <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 'confirm' ? 'bg-white' : 'bg-white/30'}`} />
                    </div>

                    {/* Error hint */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-red-400 text-xs bg-red-400/10 px-4 py-2 rounded-lg"
                            >
                                PINs don't match — try again
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Pin Pad */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                    >
                        <PinPad
                            pin={pin}
                            onDigit={(d) => setPin(p => p + d)}
                            onDelete={() => setPin(p => p.slice(0, -1))}
                            error={error}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default SetMpin;
