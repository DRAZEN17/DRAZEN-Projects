import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  getIdToken,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
];

const hasConfig = requiredVars.every((k) => !!import.meta.env[k]);

let app = null;
let auth = null;
let db = null;

if (hasConfig) {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const isEnabled = !!auth;

export async function registerWithEmail(email, password) {
  if (!auth) throw new Error('Firebase not configured');
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const token = await getIdToken(res.user);
  return { token, user: { id: res.user.uid, email: res.user.email } };
}

export async function loginWithEmail(email, password) {
  if (!auth) throw new Error('Firebase not configured');
  const res = await signInWithEmailAndPassword(auth, email, password);
  const token = await getIdToken(res.user);
  return { token, user: { id: res.user.uid, email: res.user.email } };
}

export async function logout() {
  if (!auth) return; await fbSignOut(auth);
}

export function onAuthStateChange(cb) {
  if (!auth) return () => {};
  return fbOnAuthStateChanged(auth, cb);
}

export async function getCurrentUserToken() {
  if (!auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return getIdToken(user);
}

export function getCurrentUser() {
  if (!auth) return null;
  return auth.currentUser || null;
}

export async function isCurrentUserAdmin() {
  try {
    if (!auth || !db) return false;
    const u = auth.currentUser;
    if (!u) return false;
    const d = await getDoc(doc(db, 'admins', u.uid));
    return d.exists();
  } catch {
    return false;
  }
}

export async function grantAdminByUid(uid, email) {
  if (!db) throw new Error('Firestore not configured');
  await setDoc(doc(db, 'admins', uid), { email: email || '' });
}

export default { isEnabled, registerWithEmail, loginWithEmail, logout, onAuthStateChange, getCurrentUserToken };
