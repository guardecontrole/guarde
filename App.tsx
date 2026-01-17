
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup,
    User
} from "firebase/auth";
import { 
    collection, 
    doc, 
    onSnapshot, 
    addDoc, 
    deleteDoc, 
    updateDoc, 
    setDoc, 
    getDoc,
    serverTimestamp,
    DocumentData
} from "firebase/firestore";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer, 
    ComposedChart, 
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';

import { auth, db, googleProvider, appId } from './firebase';
import { Transaction, UserProfile, SortConfig, HistoryAction, StabilityHistoryEntry } from './types';
import { 
    formatCurrency, 
    formatCompactCurrency, 
    getMonthName, 
    calculateMovingAverage, 
    calculateMovingIncomeAverage 
} from './utils';
import { 
    COLORS, TrashIcon, EditIcon, ShieldIcon, ExportIcon, ImportIcon, 
    UndoIcon, RedoIcon, HelpIcon, LogoutIcon, GoogleIcon, SortAscIcon, 
    SortDescIcon, NeutralSortIcon, ResetIcon, CalculatorIcon, AdjustIcon, 
    InfoIcon, SettingsIcon 
} from './constants';

// --- Helper Components ---

const SortIndicator: React.FC<{ sortConfig: SortConfig, columnKey: string }> = ({ sortConfig, columnKey }) => { 
    if (sortConfig.key === columnKey) { 
        return sortConfig.direction === 'ascending' ? <SortAscIcon /> : <SortDescIcon />; 
    } 
    return <NeutralSortIcon />; 
};

// ... Internal components like AuthModal, OnboardingModal, etc. would go here or in separate files.
// For the sake of this single-file block requirement, I will define them here.

const AuthModal: React.FC<{ onAuthSuccess: (user: User) => void }> = ({ onAuthSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthSuccess = async (user: User) => {
        const userRef = doc(db, "users", user.uid);
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLoginAt: serverTimestamp(),
        };
        await setDoc(userRef, userData, { merge: true });
        onAuthSuccess(user);
    };

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let userCredential;
            if (isLoginView) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const userRef = doc(db, "users", userCredential.user.uid);
                await setDoc(userRef, { plan: 'free', createdAt: serverTimestamp() }, { merge: true });
            }
            await handleAuthSuccess(userCredential.user);
        } catch (err: any) {
            setError(getFriendlyAuthError(err.code));
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userRef = doc(db, "users", result.user.uid);
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
                await setDoc(userRef, { plan: 'free', createdAt: serverTimestamp() }, { merge: true });
            }
            await handleAuthSuccess(result.user);
        } catch (err: any) {
            setError(getFriendlyAuthError(err.code));
        }
        setLoading(false);
    };
    
    const getFriendlyAuthError = (code: string) => {
        switch (code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'E-mail ou senha inválidos.';
            case 'auth/email-already-in-use':
                return 'Este e-mail já está em uso.';
            case 'auth/weak-password':
                return 'A senha deve ter pelo menos 6 caracteres.';
            case 'auth/invalid-email':
                return 'O formato do e-mail é inválido.';
            default:
                return 'Ocorreu um erro. Por favor, tente novamente.';
        }
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
                    <GoogleIcon />
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

// --- Main App ---

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [simIncomes, setSimIncomes] = useState<Transaction[]>([]);
    const [simExpenses, setSimExpenses] = useState<Transaction[]>([]);
    const [view, setView] = useState<'dashboard' | 'simulation'>('dashboard'); 
    
    const [formType, setFormType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [responsible, setResponsible] = useState('Eu');
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [editingRecord, setEditingRecord] = useState<Transaction | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'reserve' | 'incomes' | 'expenses' | 'couple'>('summary');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [history, setHistory] = useState<HistoryAction[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showFullSummary, setShowFullSummary] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showLeanCalculator, setShowLeanCalculator] = useState(false);
    const [showAdjustReserveModal, setShowAdjustReserveModal] = useState(false);

    const isSimulation = view === 'simulation';
    const participants = useMemo(() => userProfile?.participants || ['Eu'], [userProfile]);

    // ... Implementation of useEffect hooks for Firebase auth and data syncing ...
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (!u) {
                setIsLoading(false);
                setDataLoaded(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const profileRef = doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setUserProfile(data);
                if (!data.tourCompleted) setIsTourOpen(true);
            }
        });

        const incomesCol = collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`);
        const unsubIncomes = onSnapshot(incomesCol, (snapshot) => {
            const incomeData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
            setIncomes(incomeData);
            setDataLoaded(true);
        });

        const expensesCol = collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`);
        const unsubExpenses = onSnapshot(expensesCol, (snapshot) => {
            const expenseData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
            setExpenses(expenseData);
            setDataLoaded(true);
        });
        
        return () => { unsubProfile(); unsubIncomes(); unsubExpenses(); };
    }, [user]);

    // Financial Calculations
    const combinedIncomes = useMemo(() => isSimulation ? [...incomes, ...simIncomes] : incomes, [incomes, simIncomes, isSimulation]);
    const combinedExpenses = useMemo(() => isSimulation ? [...expenses, ...simExpenses] : expenses, [expenses, simExpenses, isSimulation]);

    const contextDate = useMemo(() => {
        const now = new Date();
        if (!isSimulation) return now;
        let maxTimestamp = now.getTime();
        [...combinedIncomes, ...combinedExpenses].forEach(r => {
            const d = new Date(r.year, r.month, 1);
            if (d.getTime() > maxTimestamp) maxTimestamp = d.getTime();
        });
        return new Date(maxTimestamp);
    }, [isSimulation, combinedIncomes, combinedExpenses]);

    const stabilityReserveHistory = useMemo(() => { 
        const monthlyNetIncomes: Record<string, number> = {}; 
        const adjustmentFlags: Record<string, boolean> = {};

        combinedIncomes.forEach(record => { 
            const key = `${record.year}-${String(record.month).padStart(2, '0')}`; 
            monthlyNetIncomes[key] = (monthlyNetIncomes[key] || 0) + record.amount; 
            if (record.isReserveAdjustment) adjustmentFlags[key] = true;
        }); 
        combinedExpenses.forEach(record => { 
            const key = `${record.year}-${String(record.month).padStart(2, '0')}`; 
            monthlyNetIncomes[key] = (monthlyNetIncomes[key] || 0) - record.amount; 
            if (record.isReserveAdjustment) adjustmentFlags[key] = true;
        }); 
        
        const sortedMonthKeys = Object.keys(monthlyNetIncomes).sort(); 
        const history: StabilityHistoryEntry[] = []; 
        let runningReserve = 0; 
        
        for (const monthKey of sortedMonthKeys) { 
            const [y, m] = monthKey.split('-').map(Number); 
            const avgBalance = calculateMovingAverage(y, m, combinedIncomes, combinedExpenses);
            const prevReserve = runningReserve; 
            const currentMonthBalance = monthlyNetIncomes[monthKey] || 0; 
            runningReserve += (currentMonthBalance - avgBalance); 
            if (runningReserve < 0) runningReserve = 0; 
            
            history.push({ 
                monthKey, 
                monthName: getMonthName(m, y), 
                amountAdded: runningReserve - prevReserve, 
                totalReserve: runningReserve, 
                movingAverageUsed: avgBalance,
                hasAdjustment: adjustmentFlags[monthKey] 
            }); 
        } 
        return history; 
    }, [combinedIncomes, combinedExpenses]);

    const finalStabilityReserve = stabilityReserveHistory.length > 0 ? stabilityReserveHistory[stabilityReserveHistory.length - 1].totalReserve : 0;
    const currentTwelveMonthAverage = calculateMovingAverage(contextDate.getFullYear(), contextDate.getMonth(), combinedIncomes, combinedExpenses);

    // Handlers
    const handleAddRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (!description.trim() || isNaN(val)) {
            setError("Preencha todos os campos.");
            return;
        }

        const newRecord = {
            description,
            amount: val,
            responsible: participants.length > 1 ? responsible : participants[0],
            month,
            year,
            createdAt: new Date()
        };

        if (isSimulation) {
            const simRecord = { ...newRecord, id: `sim-${Date.now()}`, isSimulated: true };
            if (formType === 'income') setSimIncomes(prev => [...prev, simRecord]);
            else setSimExpenses(prev => [...prev, simRecord]);
            setSuccess("Simulação adicionada.");
        } else if (user) {
            const colName = formType === 'income' ? 'incomes' : 'expenses';
            await addDoc(collection(db, `/artifacts/${appId}/users/${user.uid}/${colName}`), newRecord);
            setSuccess("Registro adicionado.");
        }
        setDescription('');
        setAmount('');
    };

    if (!user) return <AuthModal onAuthSuccess={setUser} />;

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen font-sans">
            <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-gray-100 hidden sm:block">Guarde Controle</h1>
                        <nav className="flex gap-4">
                            <button onClick={() => setView('dashboard')} className={`py-2 px-4 font-semibold ${view === 'dashboard' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Dashboard</button>
                            <button onClick={() => setView('simulation')} className={`py-2 px-4 font-semibold ${view === 'simulation' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Simulação</button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm hidden md:block">{user.email}</span>
                        <button onClick={() => signOut(auth)} className="p-2 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/40 transition-colors">
                            <LogoutIcon />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Saldo Sugerido</h3>
                        <p className="text-3xl font-bold text-blue-400 mt-2">{formatCurrency(currentTwelveMonthAverage)}</p>
                        <p className="text-xs text-gray-500 mt-1">Média móvel de 12 meses</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                            <ShieldIcon /> Reserva de Estabilidade
                        </h3>
                        <p className="text-3xl font-bold text-purple-400 mt-2">{formatCurrency(finalStabilityReserve)}</p>
                        <p className="text-xs text-gray-500 mt-1">Acumulado calculado mensalmente</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-center">
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">Ano de Referência</span>
                            <input 
                                type="number" 
                                value={filterYear} 
                                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-20 focus:ring-2 focus:ring-blue-500"
                            />
                         </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[400px]">
                            <h2 className="text-xl font-bold mb-4">Evolução Financeira</h2>
                            <ResponsiveContainer width="100%" height="90%">
                                <ComposedChart data={stabilityReserveHistory.slice(-12)}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="monthName" />
                                    <YAxis tickFormatter={formatCompactCurrency} />
                                    <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151'}} />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalReserve" name="Reserva" stroke="#8b5cf6" strokeWidth={3} />
                                    <Line type="monotone" dataKey="movingAverageUsed" name="Média" stroke="#3b82f6" strokeDasharray="5 5" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Transactions Table */}
                        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-700">
                                <h2 className="text-xl font-bold">Transações</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Mês</th>
                                            <th className="px-6 py-3">Descrição</th>
                                            <th className="px-6 py-3">Valor</th>
                                            <th className="px-6 py-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {combinedIncomes.filter(i => i.year === filterYear).slice(0, 10).map(t => (
                                            <tr key={t.id} className="hover:bg-gray-700/30">
                                                <td className="px-6 py-4 text-sm">{getMonthName(t.month)}</td>
                                                <td className="px-6 py-4 text-sm">{t.description}</td>
                                                <td className="px-6 py-4 text-sm text-green-400">{formatCurrency(t.amount)}</td>
                                                <td className="px-6 py-4 text-sm text-right">
                                                    <button className="text-gray-400 hover:text-white"><TrashIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {combinedExpenses.filter(e => e.year === filterYear).slice(0, 10).map(t => (
                                            <tr key={t.id} className="hover:bg-gray-700/30">
                                                <td className="px-6 py-4 text-sm">{getMonthName(t.month)}</td>
                                                <td className="px-6 py-4 text-sm">{t.description}</td>
                                                <td className="px-6 py-4 text-sm text-red-400">{formatCurrency(t.amount)}</td>
                                                <td className="px-6 py-4 text-sm text-right">
                                                    <button className="text-gray-400 hover:text-white"><TrashIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h2 className="text-xl font-bold mb-6">Nova Transação</h2>
                            <form onSubmit={handleAddRecord} className="space-y-4">
                                <div className="flex bg-gray-900 rounded-lg p-1">
                                    <button 
                                        type="button"
                                        onClick={() => setFormType('income')}
                                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${formType === 'income' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500'}`}
                                    >
                                        Entrada
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormType('expense')}
                                        className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${formType === 'expense' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}
                                    >
                                        Saída
                                    </button>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Descrição" 
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Valor R$" 
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select 
                                        value={month} 
                                        onChange={e => setMonth(parseInt(e.target.value))}
                                        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none"
                                    >
                                        {Array.from({length: 12}, (_, i) => <option key={i} value={i}>{getMonthName(i)}</option>)}
                                    </select>
                                    <input 
                                        type="number" 
                                        value={year}
                                        onChange={e => setYear(parseInt(e.target.value))}
                                        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none"
                                    />
                                </div>
                                <button className={`w-full py-3 rounded-lg font-bold text-white transition-transform active:scale-95 ${formType === 'income' ? 'bg-green-600' : 'bg-red-600'}`}>
                                    Salvar Registro
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
