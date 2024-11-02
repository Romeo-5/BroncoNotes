// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAG9hV8HOu52l2f5NCHplsBOO2CVftUUgs",
  authDomain: "bronconotes-3c743.firebaseapp.com",
  projectId: "bronconotes-3c743",
  storageBucket: "bronconotes-3c743.appspot.com",
  messagingSenderId: "971063974436",
  appId: "1:971063974436:web:3854ae3965e3378ece56b1",
  measurementId: "G-9ZKPYVG36D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  hd: "scu.edu",
});

const signInWithGoogle = () => signInWithPopup(auth, provider);
const logout = () => signOut(auth);

export { auth, signInWithGoogle, logout };
