// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjRdWFxR07ryhlI4bB8XJjBoxqXjw2LBE",
    authDomain: "guardecontrolefinanceiro.firebaseapp.com",
    projectId: "guardecontrolefinanceiro",
    storageBucket: "guardecontrolefinanceiro.appspot.com",
    messagingSenderId: "930219640587",
    appId: "1:930219640587:web:eca78fa4a2fb62960a040e",
    measurementId: "G-9D98TPEQ7V"
};

// Inicializa Firebase
const { initializeApp, getAuth, getFirestore } = window.firebase;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = firebaseConfig.appId || 'default-app-id';

// Torna disponível globalmente
window.firebaseApp = { app, db, auth, appId };
