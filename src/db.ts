// dexie-db.ts
import Dexie, { Table } from 'dexie';

export interface Transaction {
  id: string;
  data: any;  
} 

export interface Category {
    id: string;
    data: any;
}

export interface Account {
    id: string;
    data: any;
}

export class OfflineDB extends Dexie {
  transactions!: Table<Transaction, string>;
  categories!: Table<Category, string>;
  accounts!: Table<Account, string>;

  constructor() {
    super("OfflineAppDB");
    this.version(1).stores({
      transactions: "id, data"
    });
    this.version(2).stores({
        categories: "id, data",
        accounts: "id, data"
    });
  }
}

export const db = new OfflineDB();
