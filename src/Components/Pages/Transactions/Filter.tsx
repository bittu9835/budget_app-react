import { FC, useEffect, useState } from 'react';
import { TransactionFilters, getUniqueCategories } from '../../../Services/transactionService';
import { IoClose } from 'react-icons/io5';
import { VscSettings } from 'react-icons/vsc';

interface FilterBarProps {
    filters: TransactionFilters;
    onFilterChange: (filters: TransactionFilters) => void;
    compact?: boolean; // true for dashboard, false for transactions page
}

const DATE_RANGE_OPTIONS = [
    { value: '', label: 'All Time' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'last6Months', label: 'Last 6 Months' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' },
];

const ACTION_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expence', label: 'Expense' },
];

const PAYMENT_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Account', label: 'Account' },
    { value: 'Card', label: 'Card' },
];

const FilterBar: FC<FilterBarProps> = ({ filters, onFilterChange, compact = false }) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const activeFilterCount = [
        filters.dateRange,
        filters.action,
        filters.category,
        filters.paymentMethod,
    ].filter(Boolean).length;

    useEffect(() => {
        const loadCategories = async () => {
            const cats = await getUniqueCategories(filters.action || undefined);
            setCategories(cats);
        };
        loadCategories();
    }, [filters.action]);

    const handleChange = (key: keyof TransactionFilters, value: string) => {
        const updated = { ...filters, [key]: value };

        // Clear category when action changes (categories are action-specific)
        if (key === 'action') {
            updated.category = '';
        }

        // Clear custom dates when switching away from custom
        if (key === 'dateRange' && value !== 'custom') {
            updated.startDate = '';
            updated.endDate = '';
        }

        onFilterChange(updated);
    };

    const clearFilters = () => {
        onFilterChange({
            dateRange: '',
            startDate: '',
            endDate: '',
            action: '',
            category: '',
            paymentMethod: '',
            search: filters.search || '',
        });
    };

    // Mobile: toggle button
    const filterToggle = (
        <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-200 ${
                activeFilterCount > 0
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
        >
            <VscSettings className="text-base" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                </span>
            )}
        </button>
    );

    const filterContent = (
        <div className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'w-full'}`}>
            {/* Date Range */}
            <select
                value={filters.dateRange || ''}
                onChange={(e) => handleChange('dateRange', e.target.value)}
                className="h-8 px-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 cursor-pointer"
            >
                {DATE_RANGE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* Custom Date Range */}
            {filters.dateRange === 'custom' && (
                <>
                    <input
                        type="date"
                        value={filters.startDate || ''}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="h-8 px-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                        type="date"
                        value={filters.endDate || ''}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="h-8 px-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                </>
            )}

            {/* Action Type */}
            <div className="flex rounded-md border border-gray-300 overflow-hidden">
                {ACTION_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => handleChange('action', opt.value)}
                        className={`px-3 h-8 text-sm font-medium transition-colors duration-150 ${
                            (filters.action || '') === opt.value
                                ? opt.value === 'income'
                                    ? 'bg-green-500 text-white'
                                    : opt.value === 'expence'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-blue-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Category */}
            <select
                value={filters.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="h-8 px-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer max-w-[150px]"
            >
                <option value="">All Categories</option>
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            {/* Payment Method */}
            <select
                value={filters.paymentMethod || ''}
                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                className="h-8 px-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
            >
                {PAYMENT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 h-8 px-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors duration-150"
                >
                    <IoClose className="text-base" />
                    <span>Clear</span>
                </button>
            )}
        </div>
    );

    return (
        <div className="w-full">
            {/* Mobile: show toggle button */}
            <div className="sm:hidden flex items-center gap-2">
                {filterToggle}
            </div>

            {/* Mobile: collapsible filter panel */}
            {showFilters && (
                <div className="sm:hidden mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-2">
                    {filterContent}
                </div>
            )}

            {/* Desktop: always visible inline */}
            <div className="hidden sm:block">
                {filterContent}
            </div>
        </div>
    );
};

export default FilterBar;
