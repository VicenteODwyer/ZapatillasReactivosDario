// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };