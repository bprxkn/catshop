import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyANyaOVuFy1xzwXO84FdSRn49IqfHEDr3s",
    authDomain: "cat-react-499.firebaseapp.com",
    projectId: "cat-react-499",
    storageBucket: "cat-react-499.firebasestorage.app",
    messagingSenderId: "574531509079",
    appId: "1:574531509079:web:9668aeedd24bbbb364fc12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);