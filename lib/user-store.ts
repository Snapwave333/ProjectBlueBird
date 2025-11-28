import { db, ready } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'player' | 'developer';

export interface UserRecord {
  walletAddress: string;
  username: string;
  role: UserRole;
  totalEarnings: number;
  handsPlayed: number;
  bestHand?: string;
  tournamentsWon?: number;
}

function lsGet(key: string) {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function lsSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export async function getUser(walletAddress: string): Promise<UserRecord | null> {
  if (ready && db) {
    const ref = doc(db, 'users', walletAddress);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserRecord) : null;
  }
  const data = lsGet(`user:${walletAddress}`);
  return data;
}

export async function createUser(walletAddress: string, username: string): Promise<UserRecord> {
  const record: UserRecord = {
    walletAddress,
    username,
    role: 'player',
    totalEarnings: 0,
    handsPlayed: 0,
  };
  if (ready && db) {
    const ref = doc(db, 'users', walletAddress);
    await setDoc(ref, record, { merge: true });
  } else {
    lsSet(`user:${walletAddress}`, record);
  }
  return record;
}

export async function assignRole(walletAddress: string, role: UserRole): Promise<void> {
  if (ready && db) {
    const ref = doc(db, 'users', walletAddress);
    await setDoc(ref, { role }, { merge: true });
    return;
  }
  const existing = (await getUser(walletAddress)) || {
    walletAddress,
    username: 'User',
    role: 'player',
    totalEarnings: 0,
    handsPlayed: 0,
  } as UserRecord;
  existing.role = role;
  lsSet(`user:${walletAddress}`, existing);
}
