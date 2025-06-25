// dexie-db.ts
import Dexie, { Table } from 'dexie';

export interface Transaction {
  id: string;
  data: any;  
} 

export class OfflineDB extends Dexie {
  transactions!: Table<Transaction, string>;

  constructor() {
    super("OfflineAppDB");
    this.version(1).stores({
      transactions: "id, data"
    });
  }
}

export const db = new OfflineDB();
