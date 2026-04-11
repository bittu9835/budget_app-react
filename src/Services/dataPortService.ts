import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAllTransactions, addTransaction } from './transactionService';
import {
    getCustomers,
    getLedgerEntries,
    getCustomerSummary,
    addCustomer,
    addLedgerEntry,
} from './khatabookService';

const today = () => new Date().toISOString().split('T')[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(raw: any): string {
    if (!raw) return today();
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    // try DD/MM/YYYY
    const parts = String(raw).split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return today();
}

function displayDate(raw: any): string {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-IN');
}

// ─── Export: Transactions ─────────────────────────────────────────────────────

export const exportTransactionsToExcel = async (): Promise<void> => {
    const transactions = await getAllTransactions();
    const rows = transactions.map(t => ({
        Date: displayDate(t.date),
        Type: t.action === 'expence' ? 'Expense' : 'Income',
        Amount: t.amount,
        Category: t.category,
        Description: t.description,
        'Payment Method': t.paymentMethod,
        From: t.from,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    // column widths
    ws['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 18 }, { wch: 30 }, { wch: 16 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `transactions_${today()}.xlsx`);
};

export const exportTransactionsToPDF = async (): Promise<void> => {
    const transactions = await getAllTransactions();
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.setTextColor(82, 0, 187);
    doc.text('Transaction Report', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}  |  Total: ${transactions.length} records`, 14, 26);

    autoTable(doc, {
        startY: 32,
        head: [['Date', 'Type', 'Amount (₹)', 'Category', 'Description', 'Payment Method', 'From']],
        body: transactions.map(t => [
            displayDate(t.date),
            t.action === 'expence' ? 'Expense' : 'Income',
            Number(t.amount).toLocaleString('en-IN'),
            t.category,
            t.description,
            t.paymentMethod,
            t.from,
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [82, 0, 187], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 240, 255] },
        columnStyles: {
            0: { cellWidth: 24 },
            1: { cellWidth: 18 },
            2: { cellWidth: 22, halign: 'right' },
            3: { cellWidth: 30 },
            4: { cellWidth: 55 },
            5: { cellWidth: 30 },
            6: { cellWidth: 30 },
        },
    });

    doc.save(`transactions_${today()}.pdf`);
};

// ─── Export: Khatabook ────────────────────────────────────────────────────────

export const exportKhatabookToExcel = async (): Promise<void> => {
    const customers = await getCustomers();
    const customerRows: any[] = [];
    const txnRows: any[] = [];

    for (const c of customers) {
        const summary = await getCustomerSummary(c._id);
        customerRows.push({
            Name: c.name,
            Phone: c.phone,
            Address: c.address || '',
            'Total Credit (₹)': summary.totalCredit,
            'Total Debit (₹)': summary.totalDebit,
            'Net Balance (₹)': summary.netBalance,
        });

        const entries = await getLedgerEntries(c._id);
        for (const e of entries) {
            txnRows.push({
                'Customer Name': c.name,
                'Customer Phone': c.phone,
                Type: e.type,
                'Amount (₹)': e.amount,
                Note: e.note || '',
                Date: displayDate(e.timestamp),
            });
        }
    }

    const wb = XLSX.utils.book_new();
    const wsC = XLSX.utils.json_to_sheet(customerRows);
    wsC['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 30 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
    const wsT = XLSX.utils.json_to_sheet(txnRows);
    wsT['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 35 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsC, 'Customers');
    XLSX.utils.book_append_sheet(wb, wsT, 'Transactions');
    XLSX.writeFile(wb, `khatabook_${today()}.xlsx`);
};

export const exportKhatabookToPDF = async (): Promise<void> => {
    const customers = await getCustomers();
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(15, 118, 110);
    doc.text('Khatabook Report', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 26);

    // Customers summary table
    const customerRows = await Promise.all(
        customers.map(async (c) => {
            const s = await getCustomerSummary(c._id);
            return [
                c.name,
                c.phone,
                c.address || '-',
                `₹${s.totalCredit.toLocaleString('en-IN')}`,
                `₹${s.totalDebit.toLocaleString('en-IN')}`,
                `₹${s.netBalance.toLocaleString('en-IN')}`,
            ];
        })
    );

    autoTable(doc, {
        startY: 32,
        head: [['Name', 'Phone', 'Address', 'Total Credit', 'Total Debit', 'Net Balance']],
        body: customerRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [15, 118, 110], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 253, 250] },
    });

    // Ledger entries per customer
    let y = (doc as any).lastAutoTable.finalY + 10;
    for (const c of customers) {
        const entries = await getLedgerEntries(c._id);
        if (!entries.length) continue;

        if (y > 240) { doc.addPage(); y = 20; }

        doc.setFontSize(11);
        doc.setTextColor(15, 118, 110);
        doc.text(`${c.name} (${c.phone})`, 14, y);
        y += 4;

        autoTable(doc, {
            startY: y,
            head: [['Date', 'Type', 'Amount (₹)', 'Note']],
            body: entries.map(e => [
                displayDate(e.timestamp),
                e.type.charAt(0).toUpperCase() + e.type.slice(1),
                Number(e.amount).toLocaleString('en-IN'),
                e.note || '-',
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [51, 65, 85] },
            margin: { left: 14, right: 14 },
        });

        y = (doc as any).lastAutoTable.finalY + 8;
    }

    doc.save(`khatabook_${today()}.pdf`);
};

// ─── Templates ───────────────────────────────────────────────────────────────

export const downloadTransactionTemplate = (): void => {
    const sample = [
        {
            Date: '15/01/2024',
            Type: 'Income',
            Amount: 50000,
            Category: 'Salary',
            Description: 'Monthly salary',
            'Payment Method': 'Account',
            From: 'Cash',
        },
        {
            Date: '16/01/2024',
            Type: 'Expense',
            Amount: 1200,
            Category: 'Food',
            Description: 'Grocery shopping',
            'Payment Method': 'Cash',
            From: 'Cash',
        },
    ];

    const ws = XLSX.utils.json_to_sheet(sample);
    ws['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 18 }, { wch: 30 }, { wch: 16 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'transaction_import_template.xlsx');
};

export const downloadKhatabookTemplate = (): void => {
    const customers = [
        { Name: 'Rahul Sharma', Phone: '9876543210', Address: 'Mumbai' },
        { Name: 'Priya Patel', Phone: '8765432109', Address: 'Delhi' },
    ];
    const transactions = [
        { 'Customer Phone': '9876543210', Type: 'credit', Amount: 5000, Note: 'Advance payment', Date: '15/01/2024' },
        { 'Customer Phone': '9876543210', Type: 'debit', Amount: 2000, Note: 'Returned cash', Date: '20/01/2024' },
        { 'Customer Phone': '8765432109', Type: 'credit', Amount: 3000, Note: '', Date: '18/01/2024' },
    ];

    const wb = XLSX.utils.book_new();
    const wsC = XLSX.utils.json_to_sheet(customers);
    wsC['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 25 }];
    const wsT = XLSX.utils.json_to_sheet(transactions);
    wsT['!cols'] = [{ wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 30 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsC, 'Customers');
    XLSX.utils.book_append_sheet(wb, wsT, 'Transactions');
    XLSX.writeFile(wb, 'khatabook_import_template.xlsx');
};

// ─── Import: Parse file ───────────────────────────────────────────────────────

export interface ParsedRow {
    [key: string]: any;
}

export const parseFile = (file: File): Promise<{ sheets: Record<string, ParsedRow[]> }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const wb = XLSX.read(data, { type: 'array', cellDates: true });
                const sheets: Record<string, ParsedRow[]> = {};
                for (const name of wb.SheetNames) {
                    sheets[name] = XLSX.utils.sheet_to_json(wb.Sheets[name], { raw: false });
                }
                resolve({ sheets });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
};

// ─── Import: Transactions ─────────────────────────────────────────────────────

export interface TransactionImportRow {
    date: string;
    action: string;
    amount: number;
    category: string;
    description: string;
    paymentMethod: string;
    from: string;
    _valid: boolean;
    _error?: string;
}

export const mapTransactionRows = (rows: ParsedRow[]): TransactionImportRow[] => {
    return rows.map((row, i) => {
        const type = String(row['Type'] || row['type'] || row['action'] || '').toLowerCase().trim();
        const action = type === 'expense' ? 'expence' : type === 'income' ? 'income' : type;
        const amount = Number(String(row['Amount'] || row['amount'] || '0').replace(/[^0-9.]/g, ''));
        const category = String(row['Category'] || row['category'] || '').trim();
        const description = String(row['Description'] || row['description'] || '').trim();
        const paymentMethod = String(row['Payment Method'] || row['PaymentMethod'] || row['paymentMethod'] || 'Cash').trim();
        const from = String(row['From'] || row['from'] || 'Cash').trim();
        const date = formatDate(row['Date'] || row['date']);

        let _error = '';
        if (!['income', 'expence'].includes(action)) _error = `Row ${i + 2}: Type must be "Income" or "Expense"`;
        else if (!amount || isNaN(amount)) _error = `Row ${i + 2}: Amount is invalid`;
        else if (!category) _error = `Row ${i + 2}: Category is required`;
        else if (!description) _error = `Row ${i + 2}: Description is required`;

        return { date, action, amount, category, description, paymentMethod, from, _valid: !_error, _error };
    });
};

export const importTransactions = async (rows: TransactionImportRow[]): Promise<{ success: number; failed: number }> => {
    let success = 0;
    let failed = 0;
    for (const row of rows) {
        if (!row._valid) { failed++; continue; }
        try {
            await addTransaction({
                action: row.action,
                amount: row.amount,
                category: row.category,
                description: row.description,
                paymentMethod: row.paymentMethod,
                from: row.from,
                date: row.date,
                newCategory: '',
            });
            success++;
        } catch {
            failed++;
        }
    }
    return { success, failed };
};

// ─── Import: Khatabook ────────────────────────────────────────────────────────

export interface KhatabookImportRow {
    customerPhone: string;
    customerName: string;
    customerAddress: string;
    type: 'credit' | 'debit' | string;
    amount: number;
    note: string;
    date: string;
    _valid: boolean;
    _error?: string;
}

export const mapKhatabookRows = (
    customerRows: ParsedRow[],
    txnRows: ParsedRow[]
): KhatabookImportRow[] => {
    // Build a phone→name+address map from Customers sheet
    const customerMap: Record<string, { name: string; address: string }> = {};
    for (const r of customerRows) {
        const phone = String(r['Phone'] || r['phone'] || '').trim();
        if (phone) {
            customerMap[phone] = {
                name: String(r['Name'] || r['name'] || '').trim(),
                address: String(r['Address'] || r['address'] || '').trim(),
            };
        }
    }

    return txnRows.map((row, i) => {
        const phone = String(row['Customer Phone'] || row['customerPhone'] || '').trim();
        const customerInfo = customerMap[phone] || { name: phone, address: '' };
        const type = String(row['Type'] || row['type'] || '').toLowerCase().trim() as 'credit' | 'debit';
        const amount = Number(String(row['Amount'] || row['amount'] || '0').replace(/[^0-9.]/g, ''));
        const note = String(row['Note'] || row['note'] || '').trim();
        const date = formatDate(row['Date'] || row['date']);

        let _error = '';
        if (!phone) _error = `Row ${i + 2}: Customer Phone is required`;
        else if (!['credit', 'debit'].includes(type)) _error = `Row ${i + 2}: Type must be "credit" or "debit"`;
        else if (!amount || isNaN(amount)) _error = `Row ${i + 2}: Amount is invalid`;

        return {
            customerPhone: phone,
            customerName: customerInfo.name,
            customerAddress: customerInfo.address,
            type,
            amount,
            note,
            date,
            _valid: !_error,
            _error,
        };
    });
};

export const importKhatabook = async (
    customerRows: ParsedRow[],
    rows: KhatabookImportRow[]
): Promise<{ success: number; failed: number }> => {
    let success = 0;
    let failed = 0;

    // Build phone → existing customer _id map
    const existing = await getCustomers();
    const phoneToId: Record<string, string> = {};
    for (const c of existing) {
        phoneToId[c.phone] = c._id;
    }

    // Ensure all customers from the Customers sheet exist
    for (const r of customerRows) {
        const phone = String(r['Phone'] || r['phone'] || '').trim();
        const name = String(r['Name'] || r['name'] || '').trim();
        const address = String(r['Address'] || r['address'] || '').trim();
        if (phone && name && !phoneToId[phone]) {
            try {
                const id = await addCustomer({ name, phone, address });
                phoneToId[phone] = id;
            } catch { /* ignore */ }
        }
    }

    for (const row of rows) {
        if (!row._valid) { failed++; continue; }
        try {
            // Ensure customer exists
            if (!phoneToId[row.customerPhone]) {
                const id = await addCustomer({
                    name: row.customerName || row.customerPhone,
                    phone: row.customerPhone,
                    address: row.customerAddress,
                });
                phoneToId[row.customerPhone] = id;
            }
            await addLedgerEntry(
                phoneToId[row.customerPhone],
                row.type as 'credit' | 'debit',
                row.amount,
                row.note,
                row.date,
            );
            success++;
        } catch {
            failed++;
        }
    }

    return { success, failed };
};
