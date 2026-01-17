
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider,
} from "firebase/auth";
import { 
    getFirestore, 
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCjRdWFxR07ryhlI4bB8XJjBoxqXjw2LBE",
    authDomain: "guardecontrolefinanceiro.firebaseapp.com",
    projectId: "guardecontrolefinanceiro",
    storageBucket: "guardecontrolefinanceiro.appspot.com",
    messagingSenderId: "930219640587",
    appId: "1:930219640587:web:eca78fa4a2fb62960a040e",
    measurementId: "G-9D98TPEQ7V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appId = firebaseConfig.appId || 'default-app-id';
