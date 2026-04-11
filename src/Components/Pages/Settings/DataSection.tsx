import { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    exportTransactionsToExcel,
    exportTransactionsToPDF,
    exportKhatabookToExcel,
    exportKhatabookToPDF,
    downloadTransactionTemplate,
    downloadKhatabookTemplate,
    parseFile,
    mapTransactionRows,
    mapKhatabookRows,
    importTransactions,
    importKhatabook,
    type TransactionImportRow,
    type KhatabookImportRow,
    type ParsedRow,
} from '../../../Services/dataPortService';
import {
    manualSyncTransactions,
    getTransactionPendingCount,
} from '../../../Services/transactionService';
import {
    manualSyncKhatabook,
    getKhatabookPendingCount,
} from '../../../Services/khatabookService';

// ─── Small reusable button ─────────────────────────────────────────────────────

interface ActionBtnProps {
    onClick: () => void;
    loading?: boolean;
    icon: string;
    label: string;
    color: string; // tailwind bg class or inline style key
    outline?: boolean;
}

function ActionBtn({ onClick, loading, icon, label, outline }: ActionBtnProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50
                ${outline
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'text-white bg-gradient-to-r from-[#5200bb] to-[#7c3aed] hover:opacity-90'
                }`}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <span>{icon}</span>
            )}
            {label}
        </button>
    );
}

// ─── Import Preview ────────────────────────────────────────────────────────────

interface TransactionPreviewProps {
    rows: TransactionImportRow[];
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

function TransactionPreview({ rows, onConfirm, onCancel, loading }: TransactionPreviewProps) {
    const valid = rows.filter(r => r._valid);
    const errors = rows.filter(r => !r._valid);

    return (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Import Preview</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {valid.length} valid &nbsp;·&nbsp;
                        {errors.length > 0 && <span className="text-red-500">{errors.length} errors</span>}
                        {errors.length === 0 && <span className="text-green-600">No errors</span>}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || valid.length === 0}
                        className="px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}
                    >
                        {loading ? 'Importing…' : `Import ${valid.length} rows`}
                    </button>
                </div>
            </div>

            {/* Error list */}
            {errors.length > 0 && (
                <div className="bg-red-50 px-4 py-2 border-b border-red-100 max-h-24 overflow-y-auto">
                    {errors.map((r, i) => (
                        <p key={i} className="text-xs text-red-600">{r._error}</p>
                    ))}
                </div>
            )}

            {/* Preview table */}
            <div className="overflow-x-auto max-h-52">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                            {['Date', 'Type', 'Amount', 'Category', 'Description', 'Payment', 'Status'].map(h => (
                                <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.slice(0, 20).map((r, i) => (
                            <tr key={i} className={`border-t border-gray-100 ${!r._valid ? 'bg-red-50' : ''}`}>
                                <td className="px-3 py-1.5 whitespace-nowrap">{r.date}</td>
                                <td className={`px-3 py-1.5 whitespace-nowrap capitalize ${r.action === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                    {r.action === 'expence' ? 'Expense' : r.action}
                                </td>
                                <td className="px-3 py-1.5 whitespace-nowrap">₹{r.amount?.toLocaleString('en-IN')}</td>
                                <td className="px-3 py-1.5">{r.category}</td>
                                <td className="px-3 py-1.5 max-w-[140px] truncate">{r.description}</td>
                                <td className="px-3 py-1.5">{r.paymentMethod}</td>
                                <td className="px-3 py-1.5">
                                    {r._valid
                                        ? <span className="text-green-600">✓</span>
                                        : <span className="text-red-500" title={r._error}>✗</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length > 20 && (
                    <p className="text-xs text-gray-400 text-center py-2">Showing first 20 of {rows.length} rows</p>
                )}
            </div>
        </div>
    );
}

interface KhatabookPreviewProps {
    rows: KhatabookImportRow[];
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

function KhatabookPreview({ rows, onConfirm, onCancel, loading }: KhatabookPreviewProps) {
    const valid = rows.filter(r => r._valid);
    const errors = rows.filter(r => !r._valid);

    return (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Import Preview</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {valid.length} valid &nbsp;·&nbsp;
                        {errors.length > 0 ? <span className="text-red-500">{errors.length} errors</span> : <span className="text-green-600">No errors</span>}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || valid.length === 0}
                        className="px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
                    >
                        {loading ? 'Importing…' : `Import ${valid.length} entries`}
                    </button>
                </div>
            </div>

            {errors.length > 0 && (
                <div className="bg-red-50 px-4 py-2 border-b border-red-100 max-h-24 overflow-y-auto">
                    {errors.map((r, i) => (
                        <p key={i} className="text-xs text-red-600">{r._error}</p>
                    ))}
                </div>
            )}

            <div className="overflow-x-auto max-h-52">
                <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                            {['Customer', 'Phone', 'Type', 'Amount', 'Note', 'Date', 'Status'].map(h => (
                                <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.slice(0, 20).map((r, i) => (
                            <tr key={i} className={`border-t border-gray-100 ${!r._valid ? 'bg-red-50' : ''}`}>
                                <td className="px-3 py-1.5">{r.customerName}</td>
                                <td className="px-3 py-1.5">{r.customerPhone}</td>
                                <td className={`px-3 py-1.5 capitalize ${r.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>{r.type}</td>
                                <td className="px-3 py-1.5">₹{r.amount?.toLocaleString('en-IN')}</td>
                                <td className="px-3 py-1.5 max-w-[140px] truncate">{r.note || '-'}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap">{r.date}</td>
                                <td className="px-3 py-1.5">
                                    {r._valid ? <span className="text-green-600">✓</span> : <span className="text-red-500" title={r._error}>✗</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length > 20 && (
                    <p className="text-xs text-gray-400 text-center py-2">Showing first 20 of {rows.length} rows</p>
                )}
            </div>
        </div>
    );
}

// ─── Main DataSection ──────────────────────────────────────────────────────────

export default function DataSection() {
    const [exporting, setExporting] = useState<string | null>(null);

    // Sync-to-server state
    const [txnPending, setTxnPending]   = useState<number | null>(null);
    const [kbPending, setKbPending]     = useState<number | null>(null);
    const [syncingTxn, setSyncingTxn]   = useState(false);
    const [syncingKb, setSyncingKb]     = useState(false);

    // Load pending counts on mount
    useEffect(() => {
        getTransactionPendingCount().then(setTxnPending);
        getKhatabookPendingCount().then(setKbPending);
    }, []);

    // Transaction import state
    const txnFileRef = useRef<HTMLInputElement>(null);
    const [txnPreviewRows, setTxnPreviewRows] = useState<TransactionImportRow[] | null>(null);
    const [txnImporting, setTxnImporting] = useState(false);

    // Khatabook import state
    const kbFileRef = useRef<HTMLInputElement>(null);
    const [kbPreviewRows, setKbPreviewRows] = useState<KhatabookImportRow[] | null>(null);
    const [kbCustomerRows, setKbCustomerRows] = useState<ParsedRow[]>([]);
    const [kbImporting, setKbImporting] = useState(false);

    // ── Export handlers ──────────────────────────────────────────────────────

    const handleExport = async (key: string, fn: () => Promise<void>) => {
        setExporting(key);
        try {
            await fn();
            toast.success('File downloaded successfully');
        } catch (e: any) {
            toast.error('Export failed: ' + (e?.message || 'Unknown error'));
        } finally {
            setExporting(null);
        }
    };

    // ── Sync to MongoDB handlers ─────────────────────────────────────────────

    const handleSyncTransactions = async () => {
        setSyncingTxn(true);
        try {
            const { pushed, failed, pending } = await manualSyncTransactions();
            setTxnPending(pending);
            if (pushed > 0)
                toast.success(`Synced ${pushed} transaction${pushed !== 1 ? 's' : ''}${failed > 0 ? `, ${failed} failed` : ''}`);
            else if (failed > 0)
                toast.error(`${failed} transaction${failed !== 1 ? 's' : ''} failed to sync`);
            else
                toast.info('All transactions already synced');
        } catch {
            toast.error('Sync failed. Check your connection.');
        } finally {
            setSyncingTxn(false);
        }
    };

    const handleSyncKhatabook = async () => {
        setSyncingKb(true);
        try {
            const { pushed, failed, pending } = await manualSyncKhatabook();
            setKbPending(pending);
            if (pushed > 0)
                toast.success(`Synced ${pushed} khatabook record${pushed !== 1 ? 's' : ''}${failed > 0 ? `, ${failed} failed` : ''}`);
            else if (failed > 0)
                toast.error(`${failed} record${failed !== 1 ? 's' : ''} failed to sync`);
            else
                toast.info('Khatabook already synced');
        } catch {
            toast.error('Sync failed. Check your connection.');
        } finally {
            setSyncingKb(false);
        }
    };

    // ── Transaction import ───────────────────────────────────────────────────

    const handleTxnFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const { sheets } = await parseFile(file);
            const firstSheet = Object.values(sheets)[0] || [];
            const rows = mapTransactionRows(firstSheet);
            setTxnPreviewRows(rows);
        } catch {
            toast.error('Could not parse file. Please use the template format.');
        }
        e.target.value = '';
    };

    const handleTxnImportConfirm = async () => {
        if (!txnPreviewRows) return;
        setTxnImporting(true);
        try {
            const { success, failed } = await importTransactions(txnPreviewRows);
            toast.success(`Imported ${success} transactions${failed > 0 ? `, ${failed} skipped` : ''}`);
            setTxnPreviewRows(null);
        } catch {
            toast.error('Import failed. Please try again.');
        } finally {
            setTxnImporting(false);
        }
    };

    // ── Khatabook import ─────────────────────────────────────────────────────

    const handleKbFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const { sheets } = await parseFile(file);
            // Support single-sheet (Transactions only) or dual-sheet (Customers + Transactions)
            const sheetNames = Object.keys(sheets);
            let customerRows: ParsedRow[] = [];
            let txnRows: ParsedRow[] = [];

            if (sheetNames.length >= 2) {
                customerRows = sheets[sheetNames[0]] || [];
                txnRows = sheets[sheetNames[1]] || [];
            } else {
                txnRows = Object.values(sheets)[0] || [];
            }

            const rows = mapKhatabookRows(customerRows, txnRows);
            setKbCustomerRows(customerRows);
            setKbPreviewRows(rows);
        } catch {
            toast.error('Could not parse file. Please use the template format.');
        }
        e.target.value = '';
    };

    const handleKbImportConfirm = async () => {
        if (!kbPreviewRows) return;
        setKbImporting(true);
        try {
            const { success, failed } = await importKhatabook(kbCustomerRows, kbPreviewRows);
            toast.success(`Imported ${success} entries${failed > 0 ? `, ${failed} skipped` : ''}`);
            setKbPreviewRows(null);
            setKbCustomerRows([]);
        } catch {
            toast.error('Import failed. Please try again.');
        } finally {
            setKbImporting(false);
        }
    };

    // ── UI ───────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Data & Backup</h3>
                <p className="text-xs text-gray-500 mt-1">Export your data as Excel or PDF, or bulk import from a spreadsheet.</p>
            </div>

            {/* Sync to MongoDB */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                    <p className="text-sm font-bold text-blue-700">Sync to MongoDB</p>
                </div>
                <div className="p-4 space-y-3">
                    <p className="text-xs text-gray-500">Push all locally saved (offline) data to the server. Duplicates are handled safely.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Transactions sync */}
                        <div className="flex-1 border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Transactions</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {txnPending === null
                                        ? 'Checking…'
                                        : <span className="text-blue-600">{txnPending} local record{txnPending !== 1 ? 's' : ''}</span>
                                    }
                                </p>
                            </div>
                            <button
                                onClick={handleSyncTransactions}
                                disabled={syncingTxn || txnPending === 0}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-all whitespace-nowrap"
                                style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}
                            >
                                {syncingTxn
                                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : '☁️'
                                }
                                {syncingTxn ? 'Syncing…' : 'Sync Now'}
                            </button>
                        </div>

                        {/* Khatabook sync */}
                        <div className="flex-1 border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Khatabook</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {kbPending === null
                                        ? 'Checking…'
                                        : <span className="text-blue-600">{kbPending} local record{kbPending !== 1 ? 's' : ''}</span>
                                    }
                                </p>
                            </div>
                            <button
                                onClick={handleSyncKhatabook}
                                disabled={syncingKb || kbPending === 0}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-all whitespace-nowrap"
                                style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
                            >
                                {syncingKb
                                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : '☁️'
                                }
                                {syncingKb ? 'Syncing…' : 'Sync Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg,#f5f0ff,#ede9fe)' }}>
                    <p className="text-sm font-bold text-[#5200bb]">Transactions</p>
                </div>

                <div className="p-4 space-y-4">
                    {/* Export */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Export</p>
                        <div className="flex flex-wrap gap-2">
                            <ActionBtn
                                icon="📊"
                                label="Download Excel"
                                color="purple"
                                loading={exporting === 'txn-excel'}
                                onClick={() => handleExport('txn-excel', exportTransactionsToExcel)}
                            />
                            <ActionBtn
                                icon="📄"
                                label="Download PDF"
                                color="purple"
                                loading={exporting === 'txn-pdf'}
                                onClick={() => handleExport('txn-pdf', exportTransactionsToPDF)}
                            />
                        </div>
                    </div>

                    {/* Import */}
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Import</p>
                        <div className="flex flex-wrap gap-2">
                            <ActionBtn
                                icon="📥"
                                label="Download Template"
                                color="purple"
                                outline
                                onClick={downloadTransactionTemplate}
                            />
                            <ActionBtn
                                icon="⬆️"
                                label="Import Excel / CSV"
                                color="purple"
                                onClick={() => txnFileRef.current?.click()}
                            />
                            <input
                                ref={txnFileRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={handleTxnFileChange}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Columns: <span className="font-mono text-gray-500">Date · Type · Amount · Category · Description · Payment Method · From</span>
                        </p>

                        {txnPreviewRows && (
                            <TransactionPreview
                                rows={txnPreviewRows}
                                loading={txnImporting}
                                onConfirm={handleTxnImportConfirm}
                                onCancel={() => setTxnPreviewRows(null)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Khatabook */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg,#f0fdf9,#ccfbf1)' }}>
                    <p className="text-sm font-bold text-[#0f766e]">Khatabook</p>
                </div>

                <div className="p-4 space-y-4">
                    {/* Export */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Export</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleExport('kb-excel', exportKhatabookToExcel)}
                                disabled={exporting === 'kb-excel'}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
                            >
                                {exporting === 'kb-excel'
                                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : '📊'
                                }
                                Download Excel
                            </button>
                            <button
                                onClick={() => handleExport('kb-pdf', exportKhatabookToPDF)}
                                disabled={exporting === 'kb-pdf'}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
                            >
                                {exporting === 'kb-pdf'
                                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : '📄'
                                }
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* Import */}
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Import</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={downloadKhatabookTemplate}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                📥 Download Template
                            </button>
                            <button
                                onClick={() => kbFileRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                                style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
                            >
                                ⬆️ Import Excel / CSV
                            </button>
                            <input
                                ref={kbFileRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={handleKbFileChange}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Sheet 1 <span className="font-mono text-gray-500">Customers</span>: <span className="font-mono text-gray-500">Name · Phone · Address</span>
                            &nbsp;&nbsp;·&nbsp;&nbsp;
                            Sheet 2 <span className="font-mono text-gray-500">Transactions</span>: <span className="font-mono text-gray-500">Customer Phone · Type · Amount · Note · Date</span>
                        </p>

                        {kbPreviewRows && (
                            <KhatabookPreview
                                rows={kbPreviewRows}
                                loading={kbImporting}
                                onConfirm={handleKbImportConfirm}
                                onCancel={() => { setKbPreviewRows(null); setKbCustomerRows([]); }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
