import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCuIFITpq52Res2hG9TEZorKryu92U0lCI",
  authDomain: "feafa-b9aef.firebaseapp.com",
  projectId: "feafa-b9aef",
  storageBucket: "feafa-b9aef.appspot.com",
  messagingSenderId: "965213168409",
  appId: "1:965213168409:web:4e505f19df784631985b88",
  measurementId: "G-WSS1L47GJ9",
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
export default db;


