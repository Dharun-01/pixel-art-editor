import { Picture } from '../../picture';

const DB_NAME = 'pixelart-db';
const DB_VERSION = 1;
const STORE_NAME = 'autosave';

// open (or create) the database
function openDb() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		// runs when new db is created or the db version changes
		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			//create an objectStore (like a table)
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};

		request.onsuccess = (event) => resolve(event.target.result);
		request.onerror = (event) => reject(event.target.error);
	});
}

// save to indexedDB
export async function autoSave(picture) {
	try {
		const db = await openDb();

		const saveData = {
			width: picture.width,
			height: picture.height,
			pixels: picture.pixels,
		};

		// wrap in a transaction
		// 'readwrite' means we can read and write
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		// put(value,key) - overwrites if key exists
		store.put(saveData, 'current');

		transaction.oncomplete = () => db.close();
		transaction.onerror = (event) =>
			console.warn('Auto save failed:' + event.target.error);
	} catch (error) {
		console.warn('Auto save failed');
	}
}

// The purpose of this function is to retrieve the saved data from indexDB  and display it on the canvas;
export async function restoreAutoSavedPicture() {
	try {
		const db = await openDb();

		return new Promise((resolve) => {
			const transaction = db.transaction(STORE_NAME, 'readonly');
			const store = transaction.objectStore(STORE_NAME);

			const request = store.get('current');

			request.onsuccess = (event) => {
				const savedData = event.target.result;
				db.close();

				if (!savedData) {
					resolve(null);
					return;
				}
				const pixels = new Uint8ClampedArray(savedData.pixels);
				resolve(new Picture(savedData.width, savedData.height, pixels));
			};

			request.onerror = () => {
				db.close();
				resolve(null);
			};
		});
	} catch (error) {
		return null;
	}
}
