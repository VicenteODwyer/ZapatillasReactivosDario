import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBT1Kd1IAQS6HLb2Ny21m1DGJfHwBwGVkg",
    authDomain: "zapatillasreactivosdario.firebaseapp.com",
    projectId: "zapatillasreactivosdario",
    storageBucket: "zapatillasreactivosdario.firebasestorage.app",
    messagingSenderId: "927660124899",
    appId: "1:927660124899:web:56474482f810c493b3f3d6",
    measurementId: "G-7PJEVV6E8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };