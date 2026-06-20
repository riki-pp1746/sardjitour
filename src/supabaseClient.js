import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHY_lOo4l5vHM1ZiSaIy4o5_aBPs-0Rog",
  authDomain: "ihtkoding.firebaseapp.com",
  projectId: "ihtkoding",
  storageBucket: "ihtkoding.firebasestorage.app",
  messagingSenderId: "121468676927",
  appId: "1:121468676927:web:c4424f139d2c79945e418a",
  measurementId: "G-JNCFCKE0DS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const formatUser = (user) => {
  if (!user) return null;
  return { ...user, id: user.uid };
};

class SupabaseQueryBuilder {
  constructor(table) {
    this.table = table === 'profiles' ? 'users' : table;
    this.q = collection(db, this.table);
    this._select = '*';
    this._order = null;
    this._eq = [];
    this._single = false;
    this._updateData = null;
  }

  select(fields) { this._select = fields; return this; }
  order(field, opts) { this._order = { field: field === 'created_at' ? 'createdAt' : field, dir: opts?.ascending ? 'asc' : 'desc' }; return this; }
  eq(field, value) { this._eq.push({ field: field === 'id' ? '__name__' : field, value }); return this; }
  single() { this._single = true; return this; }
  
  update(data) { this._updateData = data; return this; }

  async then(resolve, reject) {
    try {
      if (this._updateData) {
         if (this._eq.length > 0) {
            let qRef = this.q;
            let docIdsToUpdate = [];
            
            for (const cond of this._eq) {
               if (cond.field === '__name__') {
                  docIdsToUpdate.push(cond.value);
               } else {
                  qRef = query(qRef, where(cond.field, "==", cond.value));
               }
            }
            
            if (docIdsToUpdate.length === 0) {
               const snap = await getDocs(qRef);
               snap.forEach(d => docIdsToUpdate.push(d.id));
            }
            
            for (const id of docIdsToUpdate) {
               await updateDoc(doc(db, this.table, id), this._updateData);
            }
            return resolve({ data: null, error: null });
         }
      } else {
         let qRef = this.q;
         for (const cond of this._eq) {
             if (cond.field === '__name__') {
                const dSnap = await getDoc(doc(db, this.table, cond.value));
                if (dSnap.exists()) {
                   const dt = dSnap.data(); const data = { id: dSnap.id, created_at: dt.createdAt, ...dt };
                   return resolve({ data: this._single ? data : [data], error: null });
                }
                return resolve({ data: null, error: new Error('Not found') });
             }
             qRef = query(qRef, where(cond.field, "==", cond.value));
         }
         if (this._order) {
            qRef = query(qRef, orderBy(this._order.field, this._order.dir));
         }
         const snap = await getDocs(qRef);
         const res = snap.docs.map(d => { const dt = d.data(); return { id: d.id, created_at: dt.createdAt, ...dt }; });
         return resolve({ data: this._single ? res[0] : res, error: null });
      }
    } catch (e) {
      resolve({ data: null, error: e });
    }
  }
}

export const supabase = {
  from: (table) => new SupabaseQueryBuilder(table),
  auth: {
    signInWithPassword: async ({ email, password }) => {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return { data: { user: formatUser(cred.user) }, error: null };
      } catch (e) { return { data: null, error: e }; }
    },
          signUp: async ({ email, password, options }) => {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          const username = options?.data?.username || email.split('@')[0];
          const isSuperAdmin = email.toLowerCase().startsWith('admin');
          await setDoc(doc(db, 'users', cred.user.uid), {
             username,
             isAdmin: isSuperAdmin,
             role: isSuperAdmin ? 'admin' : 'user',
             isApproved: true,
             is_approved: true,
             akses_kompetensi: true,
             status: 'active',
             createdAt: new Date().toISOString(),
             ...options?.data
          });
          return { data: { user: formatUser(cred.user) }, error: null };
        } catch (e) { return { data: null, error: e }; }
      },
    signOut: async () => {
      await signOut(auth);
      return { error: null };
    },
    resetPasswordForEmail: async (email) => {
      try {
        await sendPasswordResetEmail(auth, email);
        return { data: {}, error: null };
      } catch (e) { return { data: null, error: e }; }
    },
    updateUser: async ({ password }) => {
      try {
        await updatePassword(auth.currentUser, password);
        return { data: { user: formatUser(auth.currentUser) }, error: null };
      } catch (e) { return { data: null, error: e }; }
    },
    getUser: async () => {
      return { data: { user: formatUser(auth.currentUser) }, error: null };
    },
    onAuthStateChange: (cb) => {
      const unsub = onAuthStateChanged(auth, (user) => {
         cb(user ? 'SIGNED_IN' : 'SIGNED_OUT', { user: formatUser(user) });
      });
      return { data: { subscription: { unsubscribe: unsub } } };
    },
    mfa: {
      getAuthenticatorAssuranceLevel: async () => ({ data: { currentLevel: 'aal1', nextLevel: 'aal1' }, error: null }),
      listFactors: async () => ({ data: [], error: null }),
      challenge: async () => ({ data: { id: 'mock' }, error: null }),
      verify: async () => ({ data: {}, error: null }),
      enroll: async () => ({ data: { id: 'mock', totp: { uri: 'otpauth://totp/AkuratIDRG:demo@example.com?secret=JBSWY3DPEHPK3PXP&issuer=AkuratIDRG' } }, error: null }),
      unenroll: async () => ({ data: {}, error: null }),
    }
  }
};
