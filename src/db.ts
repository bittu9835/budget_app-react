// dexie-db.ts
import Dexie, { Table } from 'dexie';

export interface Transaction {
  id: string;
  data: any;
}

export interface Account {
  id: string;
  data: any;
}

export interface Category {
  id: string;   // MongoDB _id
  data: any;    // { _id, category, action, __v }
}

export interface KhatabookCustomer {
  id: string;
  data: any;    // { _id, name, phone, address, isActive, synced, deleted, created_by, created_at }
}

export interface KhatabookTransaction {
  id: string;
  data: any;    // { _id, customerId, amount, type, note, deleted, synced, timestamp, created_by }
}

export class OfflineDB extends Dexie {
  transactions!: Table<Transaction, string>;
  accounts!: Table<Account, string>;
  categories!: Table<Category, string>;
  khatabookCustomers!: Table<KhatabookCustomer, string>;
  khatabookTransactions!: Table<KhatabookTransaction, string>;

  constructor() {
    super("OfflineAppDB");
    this.version(1).stores({
      transactions: "id, data"
    });
    this.version(2).stores({
      transactions: "id, data",
      accounts: "id, data"
    });
    this.version(3).stores({
      transactions: "id, data",
      accounts: "id, data",
      categories: "id, data"
    });
    this.version(4).stores({
      transactions: "id, data",
      accounts: "id, data",
      categories: "id, data",
      khatabookCustomers: "id, data",
      khatabookTransactions: "id, data"
    });
  }
}

export const db = new OfflineDB();
