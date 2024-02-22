import { openDB } from 'idb';

const dbName = 'audioStore';
const storeName = 'audioFiles';
const version = 1; 

async function initDB() {
  const db = await openDB(dbName, version, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
}

export async function saveAudioFile(fileBlob, fileName) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const result = await store.add({ file: fileBlob, name: fileName });
  await tx.done;
  return result;
}

export async function getAllAudioFiles() {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const result = await store.getAll();
  await tx.done;
  return result;
}


