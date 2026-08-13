import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAgzCUYShbzuAZeBuECfV4jExsg72UBuGo',
  authDomain: 'reactproject-b28ac.firebaseapp.com',
  projectId: 'reactproject-b28ac',
  storageBucket: 'reactproject-b28ac.firebasestorage.app',
  messagingSenderId: '966004369498',
  appId: '1:966004369498:web:dcbbdb93a70d1167ee9063',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
