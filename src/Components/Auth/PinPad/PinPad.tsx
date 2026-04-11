import React from 'react';
import { motion } from 'framer-motion';
import { FiDelete } from 'react-icons/fi';

interface PinPadProps {
    pin: string;
    maxLength?: number;
    onDigit: (d: string) => void;
    onDelete: () => void;
    error?: boolean;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', ''];

const PinPad: React.FC<PinPadProps> = ({ pin, maxLength = 4, onDigit, onDelete, error }) => {
    return (
        <div className="flex flex-col items-center gap-8">
            {/* Dots */}
            <motion.div
                className="flex gap-5"
                animate={error ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {Array.from({ length: maxLength }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: i < pin.length ? 1.2 : 1,
                            backgroundColor: i < pin.length
                                ? 'rgba(255,255,255,1)'
                                : 'rgba(255,255,255,0)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="w-4 h-4 rounded-full border-2 border-white/70"
                    />
                ))}
            </motion.div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3">
                {KEYS.map((key, idx) => {
                    if (key === 'del') {
                        return (
                            <motion.button
                                key="del"
                                type="button"
                                whileTap={{ scale: 0.88 }}
                                onClick={onDelete}
                                className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-xl focus:outline-none"
                            >
                                <FiDelete />
                            </motion.button>
                        );
                    }
                    if (key === '') {
                        // empty placeholder (bottom-right)
                        return <div key={`empty-${idx}`} className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20" />;
                    }
                    return (
                        <motion.button
                            key={key}
                            type="button"
                            whileTap={{ scale: 0.88, backgroundColor: 'rgba(255,255,255,0.25)' }}
                            onClick={() => {
                                if (pin.length < maxLength) onDigit(key);
                            }}
                            className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-light focus:outline-none select-none"
                        >
                            {key}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default PinPad;
