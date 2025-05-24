// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyCf0kzO3-ih_2Po9IZ6zjo7lB49MP2GZ9c",
  authDomain: "quora-clone-91604.firebaseapp.com",
  projectId: "quora-clone-91604",
  storageBucket: "quora-clone-91604.appspot.com",
  messagingSenderId: "385171701666",
  appId: "1:385171701666:web:2045d93fbaf8fa91793cfb",
  measurementId: "G-24ZJSSSRHJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
