// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
export const db = getFirestore(app);
export const storage = getStorage(app);

export const fetchCourses = async () => {
    const coursesRef = collection(db, "courses");
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};