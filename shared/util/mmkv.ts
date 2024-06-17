import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { MMKV } from "react-native-mmkv";

const storageMMKV = new MMKV();

export const storage = {
  setItem: (key: string, value: any) => {
    storageMMKV.set(key, value);
  },
  getItem: (key: string) => {
    const value = storageMMKV.getString(key);
    return value === undefined ? null : value;
  },
  getBoolean: (key: string) => {
    const value = storageMMKV.getBoolean(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storageMMKV.delete(key);
  },
};

export const clientPersister = createSyncStoragePersister({
  storage,
});
