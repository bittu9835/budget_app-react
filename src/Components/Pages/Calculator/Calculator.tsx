import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { MdOutlineBackspace } from 'react-icons/md';
import { TbHistory } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface HistoryEntry {
    expression: string;
    result: string;
}

// ─── Safe expression evaluator ─────────────────────────────────────────────────

function safeEval(expr: string): number {
    // Replace display chars with JS operators
    const cleaned = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/,/g, '');

    // Allow only safe characters
    if (!/^[\d+\-*/.() ]+$/.test(cleaned)) throw new Error('Invalid expression');

    // eslint-disable-next-line no-new-func
    return Function('"use strict"; return (' + cleaned + ')')() as number;
}

function formatNumber(num: number): string {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    // Keep precision, trim floating point noise
    const str = parseFloat(num.toPrecision(12)).toString();
    // Add commas for thousands
    const parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

// Evaluate a partial expression (strips trailing operator first)
function evalPartial(expr: string): string | null {
    const clean = expr.replace(/[÷×−+]\s*$/, '').trim();
    if (!clean) return null;
    try {
        const result = safeEval(clean);
        return formatNumber(result);
    } catch {
        return null;
    }
}

// ─── Button definitions ────────────────────────────────────────────────────────

type BtnType = 'fn' | 'op' | 'num' | 'eq';

interface BtnDef {
    label: string;
    value: string;
    type: BtnType;
    wide?: boolean;
}

const BUTTONS: BtnDef[] = [
    { label: 'AC',  value: 'AC',  type: 'fn' },
    { label: '±',   value: '±',   type: 'fn' },
    { label: '%',   value: '%',   type: 'fn' },
    { label: '÷',   value: '÷',   type: 'op' },

    { label: '7',   value: '7',   type: 'num' },
    { label: '8',   value: '8',   type: 'num' },
    { label: '9',   value: '9',   type: 'num' },
    { label: '×',   value: '×',   type: 'op' },

    { label: '4',   value: '4',   type: 'num' },
    { label: '5',   value: '5',   type: 'num' },
    { label: '6',   value: '6',   type: 'num' },
    { label: '−',   value: '−',   type: 'op' },

    { label: '1',   value: '1',   type: 'num' },
    { label: '2',   value: '2',   type: 'num' },
    { label: '3',   value: '3',   type: 'num' },
    { label: '+',   value: '+',   type: 'op' },

    { label: '0',   value: '0',   type: 'num', wide: true },
    { label: '.',   value: '.',   type: 'num' },
    { label: '=',   value: '=',   type: 'eq' },
];

// ─── Calculator ────────────────────────────────────────────────────────────────

const Calculator: FC = () => {
    const [display, setDisplay]               = useState('0');
    const [expression, setExpression]         = useState('');
    const [justEvaled, setJustEvaled]         = useState(false);   // just pressed =
    const [waitingForOperand, setWaiting]     = useState(false);   // pressed operator, showing running total
    const [history, setHistory]               = useState<HistoryEntry[]>([]);
    const [showHistory, setShowHistory]       = useState(false);
    const [pressed, setPressed]               = useState<string | null>(null);
    const displayRef = useRef<HTMLDivElement>(null);

    // ── Core input handler ──────────────────────────────────────────────────────

    const handleInput = useCallback((value: string) => {
        setPressed(value);
        setTimeout(() => setPressed(null), 120);

        // ── Clear ──
        if (value === 'AC') {
            setDisplay('0');
            setExpression('');
            setJustEvaled(false);
            setWaiting(false);
            return;
        }

        // ── Backspace ──
        if (value === 'DEL') {
            if (justEvaled || waitingForOperand) {
                // After = or operator: clear result, start fresh
                setDisplay('0');
                setExpression('');
                setJustEvaled(false);
                setWaiting(false);
                return;
            }
            setDisplay(d => (d.length > 1 ? d.slice(0, -1) : '0'));
            return;
        }

        // ── Negate ──
        if (value === '±') {
            if (waitingForOperand) {
                // Start entering a negative number as the next operand
                setDisplay('-');
                setWaiting(false);
                return;
            }
            setDisplay(d => {
                if (d === '0' || d === '-') return '0';
                return d.startsWith('-') ? d.slice(1) : '-' + d;
            });
            return;
        }

        // ── Percent ──
        if (value === '%') {
            // Apply % to current display, then treat as if a number was entered
            setDisplay(d => {
                try {
                    const raw = parseFloat(d.replace(/,/g, ''));
                    if (isNaN(raw)) return 'Error';
                    return formatNumber(raw / 100);
                } catch { return 'Error'; }
            });
            setJustEvaled(false);
            setWaiting(false);
            return;
        }

        const isOperator = ['÷', '×', '−', '+'].includes(value);

        // ── Operator ──
        if (isOperator) {
            if (waitingForOperand) {
                // User changed operator before typing next number — just replace it
                setExpression(expr => expr.replace(/[÷×−+]\s*$/, '').trimEnd() + ` ${value} `);
                return;
            }

            let newExpr: string;
            if (justEvaled) {
                // After =: start a fresh chain from the result
                newExpr = `${display} ${value} `;
            } else {
                // Flush current display into expression
                newExpr = expression
                    ? `${expression}${display} ${value} `
                    : `${display} ${value} `;
            }

            setExpression(newExpr);

            // Show running total instead of 0
            const running = evalPartial(newExpr);
            setDisplay(running ?? display);

            setJustEvaled(false);
            setWaiting(true);
            return;
        }

        // ── Equals ──
        if (value === '=') {
            // Build the full expression to evaluate
            const fullExpr = waitingForOperand
                ? expression.replace(/[÷×−+]\s*$/, '').trim()   // trailing op with no second number
                : expression + display;

            if (!fullExpr) return;

            try {
                const result = safeEval(fullExpr);
                const formatted = formatNumber(result);
                if (formatted === 'Error' || formatted === '∞' || formatted === '-∞') {
                    setDisplay(formatted);
                    setExpression(fullExpr + ' =');
                } else {
                    setHistory(h => [{ expression: fullExpr, result: formatted }, ...h].slice(0, 20));
                    setDisplay(formatted);
                    setExpression(fullExpr + ' =');
                }
                setJustEvaled(true);
                setWaiting(false);
            } catch {
                setDisplay('Error');
                setExpression('');
                setJustEvaled(true);
                setWaiting(false);
            }
            return;
        }

        // ── Decimal point ──
        if (value === '.') {
            if (justEvaled || waitingForOperand) {
                setDisplay('0.');
                if (justEvaled) setExpression('');
                setJustEvaled(false);
                setWaiting(false);
                return;
            }
            setDisplay(d => (d.includes('.') ? d : d + '.'));
            return;
        }

        // ── Digit ──
        if (justEvaled || waitingForOperand) {
            setDisplay(value);
            if (justEvaled) setExpression('');
            setJustEvaled(false);
            setWaiting(false);
        } else {
            setDisplay(d => (d === '0' ? value : d.length < 12 ? d + value : d));
        }
    }, [display, expression, justEvaled, waitingForOperand]);

    // ── Keyboard support ────────────────────────────────────────────────────────

    useEffect(() => {
        const map: Record<string, string> = {
            '0':'0','1':'1','2':'2','3':'3','4':'4',
            '5':'5','6':'6','7':'7','8':'8','9':'9',
            '.':'.', '+':'+', '-':'−', '*':'×', '/':'÷',
            'Enter':'=', '=':'=', 'Escape':'AC',
            'Backspace':'DEL', '%':'%',
        };
        const handler = (e: KeyboardEvent) => {
            const v = map[e.key];
            if (v) { e.preventDefault(); handleInput(v); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleInput]);

    // ── Dynamic font size ───────────────────────────────────────────────────────

    const displayFontSize = display.replace(/,/g, '').length > 9
        ? 'text-3xl' : display.replace(/,/g, '').length > 6
        ? 'text-4xl' : 'text-5xl';

    // ── Button style ────────────────────────────────────────────────────────────

    const btnStyle = (btn: BtnDef): string => {
        const base = `
            flex items-center justify-center rounded-2xl font-bold text-xl
            select-none cursor-pointer transition-all duration-100 active:scale-95
            ${btn.wide ? 'col-span-2' : ''}
        `;
        const isPressed = pressed === btn.value;
        const scale = isPressed ? 'scale-90' : '';

        switch (btn.type) {
            case 'fn':  return `${base} ${scale} bg-gray-200 text-gray-700 hover:bg-gray-300`;
            case 'op':  return `${base} ${scale} text-white` ;
            case 'num': return `${base} ${scale} text-white hover:brightness-110`;
            case 'eq':  return `${base} ${scale} text-white`;
            default:    return base;
        }
    };

    const btnInlineStyle = (btn: BtnDef): React.CSSProperties => {
        switch (btn.type) {
            case 'op': return {
                background: 'linear-gradient(135deg, #7c3aed, #5200bb)',
                boxShadow: '0 4px 14px rgba(82,0,187,0.35)',
            };
            case 'eq': return {
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 4px 14px rgba(22,163,74,0.4)',
            };
            case 'num': return {
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.08)',
            };
            default: return {};
        }
    };

    // ─── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className='w-full h-full flex items-center justify-center p-4 overflow-auto'
            style={{ background: 'var(--color-bg-outlet)' }}>

            <div className='w-full max-w-sm flex flex-col gap-0 rounded-3xl overflow-hidden shadow-2xl'
                style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}>

                {/* ── Display area ─────────────────────────────────── */}
                <div className='px-6 pt-6 pb-4 flex flex-col gap-1 min-h-[10rem] justify-end relative'>

                    {/* History toggle */}
                    <button
                        onClick={() => setShowHistory(s => !s)}
                        className='absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-50 hover:opacity-100 transition-all hover:bg-white hover:bg-opacity-10'
                        title='History'>
                        {showHistory ? <IoClose className='text-lg' /> : <TbHistory className='text-lg' />}
                    </button>

                    {/* History dropdown */}
                    {showHistory && history.length > 0 && (
                        <div className='absolute top-12 right-4 left-4 z-10 rounded-2xl overflow-hidden shadow-2xl'
                            style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className='max-h-48 overflow-y-auto scrollbar-none'>
                                {history.map((h, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDisplay(h.result);
                                            setExpression('');
                                            setJustEvaled(true);
                                            setWaiting(false);
                                            setShowHistory(false);
                                        }}
                                        className='w-full text-right px-4 py-2 hover:bg-white hover:bg-opacity-10 transition-all border-b border-white border-opacity-5 last:border-0'>
                                        <p className='text-gray-400 text-xs truncate'>{h.expression}</p>
                                        <p className='text-white font-bold text-sm'>{h.result}</p>
                                    </button>
                                ))}
                            </div>
                            <div className='px-4 py-2 border-t border-white border-opacity-10'>
                                <button onClick={() => setHistory([])} className='text-red-400 text-xs hover:text-red-300 transition-all'>
                                    Clear history
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Expression */}
                    <p className='text-right text-sm font-medium text-gray-400 min-h-[1.25rem] truncate'>
                        {expression || '\u00A0'}
                    </p>

                    {/* Main display */}
                    <div ref={displayRef} className='flex items-end justify-end gap-3'>
                        <p className={`text-right text-white font-black tracking-tight transition-all duration-150 ${displayFontSize} break-all`}>
                            {display}
                        </p>
                    </div>

                    {/* Backspace */}
                    <div className='flex justify-end mt-1'>
                        <button
                            onClick={() => handleInput('DEL')}
                            className='text-gray-400 hover:text-white transition-all p-1 rounded-lg hover:bg-white hover:bg-opacity-10'>
                            <MdOutlineBackspace className='text-xl' />
                        </button>
                    </div>
                </div>

                {/* ── Divider ───────────────────────────────────────── */}
                <div className='h-px mx-6' style={{ background: 'rgba(255,255,255,0.08)' }} />

                {/* ── Key grid ─────────────────────────────────────── */}
                <div className='grid grid-cols-4 gap-3 p-4'>
                    {BUTTONS.map((btn) => (
                        <button
                            key={btn.label}
                            onClick={() => handleInput(btn.value)}
                            className={btnStyle(btn)}
                            style={{ ...btnInlineStyle(btn), height: '64px' }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* Keyboard hint */}
                <p className='text-center text-gray-600 text-[10px] pb-3 tracking-wider'>
                    KEYBOARD SUPPORTED
                </p>
            </div>
        </div>
    );
};

export default Calculator;
