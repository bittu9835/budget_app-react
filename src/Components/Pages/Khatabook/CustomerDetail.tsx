import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoArrowBack } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb';
import { FiDownload } from 'react-icons/fi';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    getCustomers,
    getLedgerEntries,
    getCustomerSummary,
    deleteLedgerEntry,
    CustomerData,
    LedgerEntry,
} from '../../../Services/khatabookService';
import LedgerForm from './LedgerForm';

const getInitials = (name: string): string =>
    name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase() || '').join('');

const CustomerDetail: FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [summary, setSummary] = useState({ totalCredit: 0, totalDebit: 0, netBalance: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [ledgerForm, setLedgerForm] = useState<{ open: boolean; type: 'credit' | 'debit' }>({ open: false, type: 'credit' });
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    const loadData = useCallback(async () => {
        if (!customerId) return;
        try {
            const all = await getCustomers();
            const found = all.find(c => c._id === customerId) || null;
            setCustomer(found);
            const e = await getLedgerEntries(customerId);
            setEntries(e);
            const s = await getCustomerSummary(customerId);
            setSummary(s);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [customerId]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleDeleteEntry = async (entry: LedgerEntry) => {
        if (!window.confirm('Delete this entry?')) return;
        setDeletingId(entry._id);
        try {
            await deleteLedgerEntry(entry._id);
            toast.success('Entry deleted');
            loadData();
        } catch {
            toast.error('Failed to delete entry');
        } finally {
            setDeletingId(null);
        }
    };

    const handleDownloadPdf = async () => {
        if (!customer) return;
        setDownloadingPdf(true);
        try {
            const doc = new jsPDF();
            const pageW = doc.internal.pageSize.getWidth();

            // ── Header bar ──────────────────────────────────────────
            doc.setFillColor(82, 0, 187);
            doc.rect(0, 0, pageW, 28, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Khatabook Statement', 14, 12);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated: ${moment().format('DD MMM YYYY, hh:mm A')}`, 14, 22);

            // ── Customer info ────────────────────────────────────────
            doc.setTextColor(30, 30, 30);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text(customer.name, 14, 40);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`Phone: ${customer.phone}`, 14, 48);
            if (customer.address) doc.text(`Address: ${customer.address}`, 14, 55);

            // ── Summary boxes ────────────────────────────────────────
            const summaryY = customer.address ? 64 : 57;
            const boxes = [
                { label: 'You Will Get', value: `Rs.${summary.totalCredit.toLocaleString('en-IN')}`, color: [21, 128, 61] as [number,number,number] },
                { label: 'You Will Give', value: `Rs.${summary.totalDebit.toLocaleString('en-IN')}`, color: [185, 28, 28] as [number,number,number] },
                { label: 'Net Balance', value: `Rs.${Math.abs(summary.netBalance).toLocaleString('en-IN')}`, color: [82, 0, 187] as [number,number,number] },
            ];
            boxes.forEach((b, i) => {
                const x = 14 + i * 62;
                doc.setFillColor(...b.color);
                doc.roundedRect(x, summaryY, 56, 18, 3, 3, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'bold');
                doc.text(b.label.toUpperCase(), x + 4, summaryY + 6);
                doc.setFontSize(10);
                doc.text(b.value, x + 4, summaryY + 14);
            });

            // ── Transactions table ────────────────────────────────────
            autoTable(doc, {
                startY: summaryY + 26,
                head: [['Date', 'Type', 'Amount', 'Note']],
                body: entries.map(e => [
                    moment(e.timestamp).format('DD MMM YYYY'),
                    e.type === 'credit' ? 'Credit' : 'Debit',
                    `Rs.${e.amount.toLocaleString('en-IN')}`,
                    e.note || '-',
                ]),
                headStyles: { fillColor: [82, 0, 187], textColor: 255, fontStyle: 'bold', fontSize: 9 },
                bodyStyles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [248, 245, 255] },
                columnStyles: { 2: { halign: 'right' } },
                didParseCell: (data: any) => {
                    if (data.section === 'body' && data.column.index === 1) {
                        data.cell.styles.textColor = data.cell.text[0] === 'Credit' ? [21, 128, 61] : [185, 28, 28];
                    }
                },
                margin: { left: 14, right: 14 },
            });

            doc.save(`${customer.name.replace(/\s+/g, '_')}_statement.pdf`);
            toast.success('PDF downloaded');
        } catch {
            toast.error('Failed to generate PDF');
        } finally {
            setDownloadingPdf(false);
        }
    };

    const isGet = summary.netBalance >= 0;
    const isSettled = summary.netBalance === 0;

    const headerGradient = isSettled
        ? 'linear-gradient(135deg,#4b5563,#6b7280)'
        : isGet
            ? 'linear-gradient(135deg,#15803d,#22c55e)'
            : 'linear-gradient(135deg,#b91c1c,#ef4444)';

    if (isLoading) {
        return (
            <div className='w-full h-full flex items-center justify-center' style={{ background: 'var(--color-bg-outlet)' }}>
                <div className='w-7 h-7 border-2 border-t-[#5200bb] border-transparent rounded-full animate-spin' />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className='w-full h-full flex flex-col items-center justify-center gap-3' style={{ background: 'var(--color-bg-outlet)' }}>
                <p className='text-sm opacity-50' style={{ color: 'var(--color-text)' }}>Customer not found.</p>
                <button onClick={() => navigate('/home/khatabook')} className='text-[#5200bb] underline text-sm'>Go back</button>
            </div>
        );
    }

    return (
        <div className='w-full h-full flex flex-col overflow-hidden' style={{ background: 'var(--color-bg-outlet)' }}>

            {/* ── Hero Header ─────────────────────────────────────── */}
            <div className='flex-shrink-0 text-white px-4 pt-4 pb-5 relative overflow-hidden'
                style={{ background: headerGradient }}>

                {/* Decorative circles */}
                <div className='absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10 bg-white' />
                <div className='absolute -right-2 top-10 w-16 h-16 rounded-full opacity-10 bg-white' />

                {/* Back + Avatar + Name */}
                <div className='flex items-center gap-3 mb-4 relative z-10'>
                    <button onClick={() => navigate('/home/khatabook')}
                        className='w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-all'>
                        <IoArrowBack className='text-white text-lg' />
                    </button>
                    <button onClick={handleDownloadPdf} disabled={downloadingPdf || entries.length === 0}
                        title='Download PDF statement'
                        className='w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-all disabled:opacity-40'>
                        {downloadingPdf
                            ? <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            : <FiDownload className='text-white text-base' />
                        }
                    </button>
                    <div className='w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shadow-md bg-white bg-opacity-25'>
                        {getInitials(customer.name)}
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='font-extrabold text-base truncate'>{customer.name}</p>
                        <p className='text-xs opacity-70'>📞 {customer.phone}</p>
                        {customer.address && <p className='text-xs opacity-60 truncate'>📍 {customer.address}</p>}
                    </div>
                </div>

                {/* Balance Row */}
                <div className='flex items-end justify-between relative z-10'>
                    <div className='flex gap-6'>
                        <div>
                            <p className='text-[9px] font-black uppercase tracking-widest opacity-70'>You Will Get</p>
                            <p className='text-lg font-extrabold'>₹{summary.totalCredit.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className='text-[9px] font-black uppercase tracking-widest opacity-70'>You Will Give</p>
                            <p className='text-lg font-extrabold'>₹{summary.totalDebit.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='text-[9px] font-black uppercase tracking-widest opacity-70'>Net Balance</p>
                        <p className='text-2xl font-black'>₹{Math.abs(summary.netBalance).toLocaleString('en-IN')}</p>
                        <p className='text-[9px] font-black uppercase tracking-widest opacity-90'>
                            {isSettled ? 'SETTLED' : isGet ? "YOU'LL GET" : "YOU'LL GIVE"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Credit / Debit Buttons ──────────────────────────── */}
            <div className='flex-shrink-0 flex gap-3 px-4 py-3 border-b' style={{ borderColor: 'var(--color-border)' }}>
                <button
                    onClick={() => setLedgerForm({ open: true, type: 'credit' })}
                    className='flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] transition-all duration-200'
                    style={{ background: 'linear-gradient(135deg,#16a34a,#4ade80)' }}>
                    <TbArrowBigUpFilled className='text-base' />
                    Credit
                </button>
                <button
                    onClick={() => setLedgerForm({ open: true, type: 'debit' })}
                    className='flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] transition-all duration-200'
                    style={{ background: 'linear-gradient(135deg,#dc2626,#f87171)' }}>
                    <TbArrowBigDownFilled className='text-base' />
                    Debit
                </button>
            </div>

            {/* ── Entry List ──────────────────────────────────────── */}
            <div className='flex-1 overflow-y-auto px-4 py-3 scrollbar-thin'
                style={{ scrollbarColor: 'var(--color-border) transparent' }}>

                {entries.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-40 gap-2'>
                        <p className='text-sm opacity-40' style={{ color: 'var(--color-text)' }}>No transactions yet.</p>
                        <p className='text-xs opacity-25' style={{ color: 'var(--color-text)' }}>Add a credit or debit entry above.</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-2'>
                        {entries.map(entry => {
                            const isCredit = entry.type === 'credit';
                            return (
                                <div key={entry._id}
                                    className='flex items-center gap-3 rounded-2xl px-4 py-3 border shadow-sm group transition-all duration-200 hover:shadow-md'
                                    style={{
                                        background: 'var(--color-form-bg)',
                                        borderColor: isCredit ? '#bbf7d0' : '#fecaca',
                                        borderLeftWidth: 4,
                                        borderLeftColor: isCredit ? '#16a34a' : '#dc2626',
                                    }}>

                                    {/* Icon bubble */}
                                    <div className='w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0'
                                        style={{ background: isCredit ? '#dcfce7' : '#fee2e2' }}>
                                        {isCredit
                                            ? <TbArrowBigUpFilled className='text-green-600 text-sm' />
                                            : <TbArrowBigDownFilled className='text-red-500 text-sm' />
                                        }
                                    </div>

                                    {/* Note & Date */}
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-semibold truncate' style={{ color: 'var(--color-text)' }}>
                                            {entry.note || (isCredit ? 'Credit entry' : 'Debit entry')}
                                        </p>
                                        <p className='text-xs opacity-40 mt-[1px]' style={{ color: 'var(--color-text)' }}>
                                            {moment(entry.timestamp).format('DD MMM YYYY, hh:mm A')}
                                        </p>
                                    </div>

                                    {/* Amount + Delete */}
                                    <div className='flex items-center gap-2 flex-shrink-0'>
                                        <p className='font-extrabold text-sm'
                                            style={{ color: isCredit ? '#16a34a' : '#dc2626' }}>
                                            {isCredit ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                                        </p>
                                        <button
                                            onClick={() => handleDeleteEntry(entry)}
                                            disabled={deletingId === entry._id}
                                            className='hidden group-hover:flex p-1.5 rounded-lg hover:bg-red-100 transition-all'
                                            title='Delete'>
                                            {deletingId === entry._id
                                                ? <div className='w-3 h-3 border-t border-red-400 rounded-full animate-spin' />
                                                : <MdDeleteOutline className='text-red-400 text-base' />
                                            }
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Ledger Form Modal ───────────────────────────────── */}
            {ledgerForm.open && customerId && (
                <LedgerForm
                    customerId={customerId}
                    type={ledgerForm.type}
                    onClose={() => setLedgerForm({ open: false, type: 'credit' })}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
};

export default CustomerDetail;
