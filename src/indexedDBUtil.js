import { openDB } from 'idb';

const dbName = 'audioStore';
const storeName = 'audioFiles';
const version = 1; // Use a higher version number if you are upgrading the db schema

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

// Function to save the playback time
// export async function savePlaybackTime(fileId, playbackTime) {
//   const db = await openDB(dbName, version);
//   const tx = db.transaction(storeName, 'readwrite');
//   const store = tx.objectStore(storeName);
//   const fileData = await store.get(fileId);
//   if (fileData) {
//     fileData.playbackTime = playbackTime; // Add or update playback time
//     await store.put(fileData); // Save the updated object back to the store
//   }
//   await tx.done;
// }

// Function to get the playback time
// export async function getPlaybackTime(fileId) {
//   const db = await openDB(dbName, version);
//   const tx = db.transaction(storeName, 'readonly');
//   const store = tx.objectStore(storeName);
//   const fileData = await store.get(fileId);
//   await tx.done;
//   return fileData ? fileData.playbackTime : null; // Return the playback time if available
// }

export async function savePlaybackTime(fileId, playbackTime) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const fileData = await store.get(fileId);
  if (fileData) {
    fileData.playbackTime = playbackTime; // Add or update playbackTime
    await store.put(fileData); // Save the updated data back to the store
  }
  await tx.done;
}

// Function to get the playback time for a given file ID
export async function getPlaybackTime(fileId) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const fileData = await store.get(fileId);
  await tx.done;
  return fileData ? fileData.playbackTime : null; // Return playbackTime if available
}


