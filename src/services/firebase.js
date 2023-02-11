import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyBF414Xe0rgT4Auk6bFPtNrg1ABtlARQYw",
  authDomain: "ma-galery.firebaseapp.com",
  projectId: "ma-galery",
  storageBucket: "ma-galery.appspot.com",
  messagingSenderId: "8866788089",
  appId: "1:8866788089:web:0c74657fc6739b9d2be828",
  measurementId: "G-945F35FS3Q"
};


const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
export {db, storage};