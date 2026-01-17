const AuthModal = ({ auth, db }) => {
    const { useState } = React;
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // FUNÇÃO ATUALIZADA: Traduz códigos de erro do Firebase para português
    const getFriendlyAuthError = (error) => {
        // Extrai o código do objeto de erro recebido
        const errorCode = error.code;

        switch (errorCode) {
            // Erros comuns de e-mail/senha
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential': // Código unificado com "Email Enumeration Protection" ativo
                return 'E-mail ou senha incorretos.';
            case 'auth/email-already-in-use':
                return 'Este e-mail já está em uso.';
            case 'auth/weak-password':
                return 'A senha deve ter pelo menos 6 caracteres.';
            case 'auth/invalid-email':
                return 'O formato do e-mail é inválido.';
            case 'auth/too-many-requests':
                return 'Muitas tentativas de login. Por favor, tente novamente mais tarde.';
            case 'auth/user-disabled':
                return 'Esta conta foi desativada por um administrador.';

            // Erro crítico que precisa de diagnóstico
            case 'auth/internal-error':
            case 'auth/network-request-failed':
                console.error('Erro técnico do Firebase durante login:', error.message, error);
                return `Erro de conexão ou interno. Verifique o console do navegador (F12 > Console) para mais detalhes. Código: ${errorCode}`;

            // Captura qualquer outro erro inesperado
            default:
                console.error('Código de erro do Firebase não tratado:', errorCode, error.message, error);
                return `Ocorreu um erro inesperado (${errorCode}). Verifique o console do navegador.`;
        }
    };

    const handleAuthSuccess = async (userCredential) => {
        const user = userCredential.user;
        const userRef = window.firebase.doc(db, "users", user.uid);
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLoginAt: window.firebase.serverTimestamp(),
        };
        await window.firebase.setDoc(userRef, userData, { merge: true });
    };

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let userCredential;
            if (isLoginView) {
                userCredential = await window.firebase.signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await window.firebase.createUserWithEmailAndPassword(auth, email, password);
                const userRef = window.firebase.doc(db, "users", userCredential.user.uid);
                await window.firebase.setDoc(userRef, { plan: 'free', createdAt: window.firebase.serverTimestamp() }, { merge: true });
            }
            await handleAuthSuccess(userCredential);
        } catch (err) {
            // PASSO CRÍTICO: Envia o ERRO COMPLETO para a função de tradução
            const friendlyError = getFriendlyAuthError(err);
            setError(friendlyError);
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new window.firebase.GoogleAuthProvider();
            const result = await window.firebase.signInWithPopup(auth, provider);
            const userRef = window.firebase.doc(db, "users", result.user.uid);
            const docSnap = await window.firebase.getDoc(userRef);
            if (!docSnap.exists()) {
                await window.firebase.setDoc(userRef, { plan: 'free', createdAt: window.firebase.serverTimestamp() }, { merge: true });
            }
            await handleAuthSuccess(result);
        } catch (err) {
            const friendlyError = getFriendlyAuthError(err);
            setError(friendlyError);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold text-gray-100 mb-2 text-center">{isLoginView ? 'Bem-vindo de volta!' : 'Crie sua conta'}</h2>
                <p className="text-gray-400 text-center mb-6">{isLoginView ? 'Insira suas credenciais para acessar.' : 'Cadastre-se para começar a controlar suas finanças.'}</p>
                {error && <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4" role="alert">{error}</div>}
                <form onSubmit={handleAuthAction}>
                    <div className="space-y-4">
                        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed">
                        {loading ? 'Processando...' : (isLoginView ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>
                <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-500">OU</span></div></div>
                <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex justify-center items-center py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors border border-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed">
                    <window.icons.GoogleIcon />
                    {isLoginView ? 'Entrar com o Google' : 'Cadastrar com o Google'}
                </button>
                <p className="mt-6 text-center text-sm text-gray-400">
                    {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-blue-400 hover:text-blue-300 ml-1">
                        {isLoginView ? 'Cadastre-se' : 'Entrar'}
                    </button>
                </p>
            </div>
        </div>
    );
};

// Exporta globalmente
window.AuthModal = AuthModal;
