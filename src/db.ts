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

export class OfflineDB extends Dexie {
  transactions!: Table<Transaction, string>;
  accounts!: Table<Account, string>;
  categories!: Table<Category, string>;

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
  }
}

export const db = new OfflineDB();
