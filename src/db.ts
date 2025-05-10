import Dexie from 'dexie';

export const db = new Dexie("OfflineFormDB");
db.version(1).stores({
  forms: "++id, formId, data, timestamp"
});
