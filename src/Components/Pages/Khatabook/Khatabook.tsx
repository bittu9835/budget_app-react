import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdOutlinePersonAdd, MdDeleteOutline, MdOutlineEdit, MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { FiSearch, FiEyeOff } from 'react-icons/fi';
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb';
import {
    getCustomers,
    getCustomerSummary,
    deleteCustomer,
    getDashboardTotals,
    syncKhatabookFromServer,
    toggleCountInSummary,
    CustomerData,
} from '../../../Services/khatabookService';
import CustomerForm from './CustomerForm';

interface CustomerWithSummary extends CustomerData {
    totalCredit: number;
    totalDebit: number;
    netBalance: number;
}

const getInitials = (name: string): string =>
    name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase() || '').join('');

const Khatabook: FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<CustomerWithSummary[]>([]);
    const [filtered, setFiltered] = useState<CustomerWithSummary[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [customerForEdit, setCustomerForEdit] = useState<CustomerData | null>(null);
    const [totals, setTotals] = useState({ totalYouWillGet: 0, totalYouWillGive: 0 });
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            const list = await getCustomers();
            const withSummary: CustomerWithSummary[] = await Promise.all(
                list.map(async c => {
                    const summary = await getCustomerSummary(c._id);
                    return { ...c, ...summary };
                })
            );
            withSummary.sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance));
            setCustomers(withSummary);
            setFiltered(withSummary);
            const t = await getDashboardTotals();
            setTotals(t);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        syncKhatabookFromServer().then(loadData);
    }, [loadData]);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(customers.filter(c =>
            c.name.toLowerCase().includes(q) || c.phone.includes(q)
        ));
    }, [search, customers]);

    const handleDelete = async (e: React.MouseEvent, customer: CustomerWithSummary) => {
        e.stopPropagation();
        if (!window.confirm(`Delete "${customer.name}"? All entries will also be removed.`)) return;
        setDeletingId(customer._id);
        try {
            await deleteCustomer(customer._id);
            toast.success('Customer deleted');
            loadData();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (e: React.MouseEvent, customer: CustomerWithSummary) => {
        e.stopPropagation();
        setCustomerForEdit(customer);
        setShowForm(true);
    };

    const handleToggleCount = async (e: React.MouseEvent, customer: CustomerWithSummary) => {
        e.stopPropagation();
        const newValue = customer.countInSummary === false ? true : false;
        setCustomers(prev => prev.map(c =>
            c._id === customer._id ? { ...c, countInSummary: newValue } : c
        ));
        await toggleCountInSummary(customer._id, newValue);
        const t = await getDashboardTotals();
        setTotals(t);
    };

    return (
        <div className='w-full h-full flex flex-col overflow-hidden' style={{ background: 'var(--color-bg-outlet)' }}>

            {/* ── Summary Banner ─────────────────────────────────── */}
            <div className='flex-shrink-0 px-4 pt-4 pb-3 flex gap-3'>
                {/* You Will Get */}
                <div className='flex-1 rounded-2xl p-4 shadow-md overflow-hidden relative'
                    style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
                    <div className='absolute right-2 top-2 opacity-20 text-6xl'>
                        <TbArrowBigUpFilled />
                    </div>
                    <p className='text-white text-[10px] font-bold uppercase tracking-widest opacity-80'>You Will Get</p>
                    <p className='text-white text-2xl font-extrabold mt-1'>
                        ₹{totals.totalYouWillGet.toLocaleString('en-IN')}
                    </p>
                </div>

                {/* You Will Give */}
                <div className='flex-1 rounded-2xl p-4 shadow-md overflow-hidden relative'
                    style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                    <div className='absolute right-2 top-2 opacity-20 text-6xl'>
                        <TbArrowBigDownFilled />
                    </div>
                    <p className='text-white text-[10px] font-bold uppercase tracking-widest opacity-80'>You Will Give</p>
                    <p className='text-white text-2xl font-extrabold mt-1'>
                        ₹{totals.totalYouWillGive.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            {/* ── Search ─────────────────────────────────────────── */}
            <div className='flex-shrink-0 px-4 pb-3'>
                <div className='flex items-center gap-2 rounded-xl px-4 py-2 border'
                    style={{
                        background: 'var(--color-form-bg)',
                        borderColor: 'var(--color-border)'
                    }}>
                    <FiSearch style={{ color: 'var(--color-text)', opacity: 0.4 }} />
                    <input
                        type='text'
                        placeholder='Search by name or phone...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className='w-full bg-transparent outline-none text-sm'
                        style={{ color: 'var(--color-text)' }}
                    />
                    {search && (
                        <button onClick={() => setSearch('')}
                            className='text-xs opacity-40 hover:opacity-70 transition-all'
                            style={{ color: 'var(--color-text)' }}>✕</button>
                    )}
                </div>
            </div>

            {/* ── Customer List ───────────────────────────────────── */}
            <div className='flex-1 overflow-y-auto px-4 pb-24 scrollbar-thin'
                style={{ scrollbarColor: 'var(--color-border) transparent' }}>

                {isLoading ? (
                    <div className='flex items-center justify-center h-40'>
                        <div className='w-7 h-7 border-2 border-t-[#5200bb] border-transparent rounded-full animate-spin' />
                    </div>

                ) : filtered.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-48 gap-3'>
                        <div className='w-16 h-16 rounded-full flex items-center justify-center opacity-20'
                            style={{ background: 'var(--color-form-bg)' }}>
                            <MdOutlinePersonAdd className='text-3xl' style={{ color: 'var(--color-text)' }} />
                        </div>
                        <p className='text-sm opacity-40' style={{ color: 'var(--color-text)' }}>
                            {search ? 'No customers match your search' : 'No customers yet. Add your first one!'}
                        </p>
                    </div>

                ) : (
                    <div className='flex flex-col gap-2'>
                        {filtered.map(customer => {
                            const isGet = customer.netBalance >= 0;
                            const displayAmount = Math.abs(customer.netBalance);
                            const isSettled = customer.netBalance === 0;

                            return (
                                <div
                                    key={customer._id}
                                    onClick={() => navigate(`/home/khatabook/${customer._id}`)}
                                    className='flex items-center gap-3 rounded-2xl px-3 py-3 cursor-pointer group transition-all duration-200 shadow-sm hover:shadow-md border'
                                    style={{
                                        background: 'var(--color-form-bg)',
                                        borderColor: 'var(--color-border)',
                                        opacity: customer.countInSummary === false ? 0.75 : 1,
                                    }}
                                >
                                    {/* Checkbox — count in summary toggle */}
                                    <button
                                        onClick={e => handleToggleCount(e, customer)}
                                        title={customer.countInSummary === false ? 'Excluded from totals — click to include' : 'Included in totals — click to exclude'}
                                        className='flex-shrink-0 transition-colors'
                                    >
                                        {customer.countInSummary === false
                                            ? <MdCheckBoxOutlineBlank className='text-xl text-gray-400' />
                                            : <MdCheckBox className='text-xl text-[#5200bb]' />
                                        }
                                    </button>

                                    {/* Avatar */}
                                    <div className='w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md'
                                        style={{
                                            background: isSettled
                                                ? 'linear-gradient(135deg,#6b7280,#9ca3af)'
                                                : isGet
                                                    ? 'linear-gradient(135deg,#dc2626,#f87171)'
                                                    : 'linear-gradient(135deg,#16a34a,#4ade80)'
                                        }}>
                                        {getInitials(customer.name)}
                                    </div>

                                    {/* Name + Phone */}
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-bold text-sm truncate' style={{ color: 'var(--color-text)' }}>
                                            {customer.name}
                                        </p>
                                        <p className='text-xs opacity-50 mt-[1px]' style={{ color: 'var(--color-text)' }}>
                                            {customer.phone}
                                        </p>
                                    </div>

                                    {/* Balance */}
                                    <div className='flex flex-col items-end flex-shrink-0'>
                                        <p className='font-extrabold text-sm'
                                            style={{ color: isSettled ? '#6b7280' : isGet ? '#dc2626' : '#16a34a' }}>
                                            ₹{displayAmount.toLocaleString('en-IN')}
                                        </p>
                                        {customer.countInSummary === false ? (
                                            <span className='flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide text-orange-400 mt-[1px]'>
                                                <FiEyeOff className='text-[9px]' /> Not counted
                                            </span>
                                        ) : (
                                            <span className='text-[9px] font-black uppercase tracking-widest mt-[1px]'
                                                style={{ color: isSettled ? '#6b7280' : isGet ? '#dc2626' : '#16a34a' }}>
                                                {isSettled ? 'SETTLED' : isGet ? "YOU'LL GET" : "YOU'LL GIVE"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Hover actions */}
                                    <div className='hidden group-hover:flex items-center gap-1 ml-1'>
                                        <button onClick={e => handleEdit(e, customer)}
                                            className='p-1.5 rounded-lg transition-all hover:bg-blue-100'
                                            title='Edit'>
                                            <MdOutlineEdit className='text-blue-500 text-base' />
                                        </button>
                                        <button onClick={e => handleDelete(e, customer)}
                                            disabled={deletingId === customer._id}
                                            className='p-1.5 rounded-lg transition-all hover:bg-red-100'
                                            title='Delete'>
                                            {deletingId === customer._id
                                                ? <div className='w-3 h-3 border-t border-red-500 rounded-full animate-spin' />
                                                : <MdDeleteOutline className='text-red-500 text-base' />
                                            }
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Floating Add Button ─────────────────────────────── */}
            <button
                onClick={() => { setCustomerForEdit(null); setShowForm(true); }}
                className='fixed bottom-20 md:bottom-6 right-5 flex items-center gap-2 text-white px-5 py-3 rounded-full shadow-xl transition-all duration-200 hover:scale-105 z-30'
                style={{ background: 'linear-gradient(135deg,#5200bb,#7c3aed)' }}
            >
                <MdOutlinePersonAdd className='text-xl' />
                <span className='text-sm font-bold hidden sm:inline'>Add Customer</span>
            </button>

            {/* ── Customer Form Modal ─────────────────────────────── */}
            {showForm && (
                <CustomerForm
                    onClose={() => { setShowForm(false); setCustomerForEdit(null); }}
                    onSuccess={loadData}
                    customerForEdit={customerForEdit}
                />
            )}
        </div>
    );
};

export default Khatabook;
