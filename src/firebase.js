import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBa1-lYpDy1fe2tCs7Jui36sYC7NVwE-l0",
    authDomain: "collab-ad6e5.firebaseapp.com",
    projectId: "collab-ad6e5",
    storageBucket: "collab-ad6e5.appspot.com",
    messagingSenderId: "853885886811",
    appId: "1:853885886811:web:58fdb53c62787c605aba7e",
    measurementId: "G-XZXVVNF0ZT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
