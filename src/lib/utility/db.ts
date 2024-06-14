import type { TDatabase } from "./types";

const connect = (): Promise<TDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('starwars', 1);

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

			if (!db.objectStoreNames.contains('planets')) {
				db.createObjectStore('planets', { keyPath: 'id' });
			};

			if (!db.objectStoreNames.contains('residents')) {
				db.createObjectStore('residents', { keyPath: 'id' });
			}
		};

		request.onsuccess = (event: Event) => {
			const req = event.target as IDBOpenDBRequest;
			const db = req.result as IDBDatabase;

			resolve(db);
		};

		request.onerror = (event: Event) => {
			const req = event.target as IDBOpenDBRequest;

			reject(req.error);
		};
	});
};

const getRecord = async (store: string, key: string): Promise<any> => {
	try {
		const db = await connect();
		const txn = db.transaction([store], 'readonly');
		const txnStore = txn.objectStore(store);
		const request = txnStore.get(key);

		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	} catch (error: any) {
		throw new Error(error);
	}
};

const setRecord = async (store: string, key: string, val: any): Promise<boolean> => {
	try {
		const db = await connect();
		const txn = db.transaction([store], 'readwrite');
		const txnStore = txn.objectStore(store);
		const request = txnStore.put({ id: key, ...val });

		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(true);
			request.onerror = () => reject(request.error);
		});
	} catch (error: any) {
		throw new Error(error);
	}
};

const deleteRecord = async (store: string, key: string): Promise<boolean> => {
	try {
		const db = await connect();
		const txn = db.transaction([store], 'readwrite');
		const txnStore = txn.objectStore(store);
		const request = txnStore.delete(key);

		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(true);
			request.onerror = () => reject(request.error);
		});
	} catch (error: any) {
		throw new Error(error);
	}
};

export {
	getRecord,
	setRecord,
	deleteRecord
}