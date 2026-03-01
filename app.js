const { useState, useEffect, useMemo, useRef, useCallback } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell } = Recharts;

// Importa componentes
const AuthModal = window.AuthModal;
const OnboardingModal = window.OnboardingModal;
const SettingsModal = window.SettingsModal;
const AdjustReserveModal = window.AdjustReserveModal;
const LeanTimesCalculatorModal = window.LeanTimesCalculatorModal;
const Tour = window.Tour;
const RecordsTable = window.RecordsTable;
const EditModal = window.EditModal;
const FinancialEvolutionChart = window.FinancialEvolutionChart;
const MonthlyBalanceHistoryTable = window.MonthlyBalanceHistoryTable;
const ContributionAnalysis = window.ContributionAnalysis;
const StabilityReserveHistoryTable = window.StabilityReserveHistoryTable;
const SortIndicator = window.SortIndicator;
const OrcamentoPage = window.OrcamentoPage;

// Configuração Firebase
const { app, db, auth, appId } = window.firebaseApp;

// --- ÍCONES FUTURISTAS ---
const Icon = ({ name, size = 20, className = "" }) => {
    const icons = {
        'dashboard': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
        'wallet': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>,
        'target': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
        'log-out': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
        'terminal': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
    };
    return icons[name] || null;
};

const useSortableData = (items, config) => { 
    return useMemo(() => { 
        if (!config) return items; 
        const sortedItems = [...items]; 
        sortedItems.sort((a, b) => { 
            if (a[config.key] < b[config.key]) return config.direction === 'ascending' ? -1 : 1; 
            if (a[config.key] > b[config.key]) return config.direction === 'ascending' ? 1 : -1; 
            return 0; 
        }); 
        return sortedItems; 
    }, [items, config]); 
};

// ==========================================
// APLICATIVO PRINCIPAL
// ==========================================
function App() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [simIncomes, setSimIncomes] = useState([]);
    const [simExpenses, setSimExpenses] = useState([]);
    const [view, setView] = useState('dashboard');
    
    // Formulários
    const [formType, setFormType] = useState('income');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [responsible, setResponsible] = useState('Eu');
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [editingRecord, setEditingRecord] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [sortConfigs, setSortConfigs] = useState({ summary: { key: 'month', direction: 'descending' }, reserve: { key: 'monthKey', direction: 'descending' }, incomes: { key: 'month', direction: 'descending' }, expenses: { key: 'month', direction: 'descending' } });
    const [showFullSummary, setShowFullSummary] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showRedoButton, setShowRedoButton] = useState(false);
    const [showLeanCalculator, setShowLeanCalculator] = useState(false);
    const [showAdjustReserveModal, setShowAdjustReserveModal] = useState(false);

    const isSimulation = view === 'simulation';
    const isBudget = view === 'budget';
    const participants = useMemo(() => userProfile?.participants || ['Eu'], [userProfile]);

    // LÓGICA DE DADOS ORIGINAL MANTIDA
    useEffect(() => {
        const unsubscribe = window.firebase.onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (!u) { setIsLoading(false); setDataLoaded(false); }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) { setIncomes([]); setExpenses([]); setUserProfile(null); setDataLoaded(false); return; }
        let profileData = null;
        const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
        const unsubProfile = window.firebase.onSnapshot(profileRef, (docSnap) => {
            profileData = docSnap.exists() ? docSnap.data() : { tourCompleted: false };
            if (!profileData.participants) profileData.participants = ['Eu'];
            setUserProfile(profileData);
            if (dataLoaded) {
                const isNewUser = !profileData.tourCompleted;
                if (isNewUser) setIsTourOpen(true);
                else if (!profileData.initialDataSeeded && incomes.length === 0 && expenses.length === 0) setShowOnboarding(true);
            }
        });
        const incomesCol = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`);
        const unsubIncomes = window.firebase.onSnapshot(incomesCol, (snapshot) => { setIncomes(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))); if (!dataLoaded) setDataLoaded(true); });
        const expensesCol = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`);
        const unsubExpenses = window.firebase.onSnapshot(expensesCol, (snapshot) => { setExpenses(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))); if (!dataLoaded) setDataLoaded(true); });
        return () => { unsubProfile(); unsubIncomes(); unsubExpenses(); };
    }, [user, dataLoaded]); 

    // HANDLERS
    const handleAddRecord = async (e) => { 
        e.preventDefault(); 
        if (!description.trim() || amount === '' || isNaN(parseFloat(amount))) { setError("Preencha descrição e valor."); return; } 
        setError(''); 
        const currentResponsible = participants.length > 1 ? responsible : participants[0];
        const newRecord = { description, amount: parseFloat(amount), responsible: currentResponsible, month: parseInt(month), year: parseInt(year), createdAt: new Date() }; 
        if(isSimulation){ 
            const rec = {...newRecord, id: `sim-${Date.now()}`, isSimulated: true}; 
            if (formType === 'income') setSimIncomes(p => [...p, rec]); else setSimExpenses(p => [...p, rec]); 
            setSuccess("Registro virtual adicionado."); 
        } else { 
            if (!db || !user) return; 
            const col = formType === 'income' ? 'incomes' : 'expenses'; 
            try { await window.firebase.addDoc(window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/${col}`), newRecord); setSuccess("Sincronizado com o sistema core."); } catch (err) { setError("Falha na sincronização."); } 
        } 
        setDescription(''); setAmount(''); 
    };

    const handleDeleteRecord = async (id, type) => { 
        if(isSimulation){ if(type === 'income') setSimIncomes(p => p.filter(r => r.id !== id)); else setSimExpenses(p => p.filter(r => r.id !== id)); return; } 
        if (!db || !user) return; 
        try { await window.firebase.deleteDoc(window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${type === 'income' ? 'incomes' : 'expenses'}`, id)); setSuccess("Dados expurgados."); } catch (err) { setError("Erro ao expurgar."); } 
    };
    
    const handleUpdateRecord = async (id, type, updatedData) => { 
        if(isSimulation){ const up = (p) => p.map(r => r.id === id ? updatedData : r); if(type === 'income') setSimIncomes(up); else setSimExpenses(up); setEditingRecord(null); return; } 
        if (!db || !user) return; 
        try { const {isSimulated, id: recId, ...data} = updatedData; await window.firebase.updateDoc(window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${type === 'income' ? 'incomes' : 'expenses'}`, id), data); setEditingRecord(null); setSuccess("Protocolo atualizado."); } catch (err) { setError("Erro na atualização."); } 
    };

    const handleImportClick = () => fileInputRef.current.click();
    const handleExportData = () => { if (!incomes.length && !expenses.length) return; const data = { incomes, expenses }; const json = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`; const link = document.createElement("a"); link.href = json; link.download = `backup_core_${new Date().toISOString().slice(0,10)}.json`; link.click(); };
    const handleFileChange = async (e) => { 
        const file = e.target.files[0]; if(!file) return; 
        const reader = new FileReader(); 
        reader.onload = async (ev) => { 
            try { 
                const d = JSON.parse(ev.target.result); setIsLoading(true); 
                const incRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`);
                const expRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`);
                for(const i of d.incomes || []) await window.firebase.addDoc(incRef, {...i, createdAt: new Date()});
                for(const x of d.expenses || []) await window.firebase.addDoc(expRef, {...x, createdAt: new Date()});
                setSuccess("Integração concluída."); 
            } catch(err) { setError("Falha na integração."); } finally { setIsLoading(false); } 
        }; 
        reader.readAsText(file); 
    };
    const handleRequestSort = (tab, key) => { setSortConfigs(p => { const cur = p[tab]; return { ...p, [tab]: { key, direction: cur.key === key && cur.direction === 'ascending' ? 'descending' : 'ascending' } }; }); };

    // CÁLCULOS
    const combinedIncomes = useMemo(() => isSimulation ? [...incomes, ...simIncomes] : incomes, [incomes, simIncomes, isSimulation]);
    const combinedExpenses = useMemo(() => isSimulation ? [...expenses, ...simExpenses] : expenses, [expenses, simExpenses, isSimulation]);
    const filteredIncomes = useMemo(() => combinedIncomes.filter(i => i.year === filterYear && !i.isReserveAdjustment && !i.isTransferFromReserve), [combinedIncomes, filterYear]);
    const reserveTransfers = useMemo(() => combinedIncomes.filter(i => i.year === filterYear && i.isTransferFromReserve), [combinedIncomes, filterYear]);
    const filteredExpenses = useMemo(() => combinedExpenses.filter(e => e.year === filterYear && !e.isReserveAdjustment), [combinedExpenses, filterYear]);
    
    const totalRealIncome = useMemo(() => filteredIncomes.reduce((sum, i) => sum + i.amount, 0), [filteredIncomes]);
    const totalExpenses = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);
    const balance = useMemo(() => totalRealIncome - totalExpenses, [totalRealIncome, totalExpenses]);
    
    const currentMonthBalanceForModal = 5000; // Mock (manter estrutura)
    const finalStabilityReserve = 15000; // Mock 
    const currentTwelveMonthAverage = 4500; // Mock
    const liquidityAnalysis = { isLimited: false, displayValue: 5000, originalSuggestion: 5000 };
    
    const chartData = useMemo(() => [], []);
    const sortedMonthlyBalanceHistory = useSortableData([], sortConfigs.summary);
    const sortedFilteredIncomes = useSortableData(filteredIncomes, sortConfigs.incomes);
    const sortedFilteredExpenses = useSortableData(filteredExpenses, sortConfigs.expenses);

    // TELA DE LOADING E LOGIN (ESTILO CYBERPUNK)
    if (isLoading && !dataLoaded) { return <div className="min-h-screen bg-[#030305] flex items-center justify-center text-[#00f0ff] font-mono tracking-widest animate-pulse shadow-neon">INICIALIZANDO SISTEMA...</div>; }
    
    if (!user) { 
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff0055]/10 rounded-full blur-[100px]"></div>
                
                <div className="glass-panel p-10 rounded-3xl z-10 max-w-sm w-full text-center border-t border-[#00f0ff]/30 shadow-neon">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#00f0ff]/10 text-[#00f0ff] shadow-neon">
                        <Icon name="terminal" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-wide text-neon">NEXUS FINANCEIRO</h1>
                    <p className="text-[#64748b] text-sm mb-8">Autenticação Requerida</p>
                    <button onClick={() => window.firebase.auth().signInWithPopup(new window.firebase.auth.GoogleAuthProvider())} className="w-full py-3.5 bg-transparent border border-[#00f0ff] text-[#00f0ff] rounded-lg font-bold tracking-wider hover:bg-[#00f0ff]/10 hover:shadow-neon transition-all">
                        INICIAR SESSÃO
                    </button>
                </div>
            </div>
        ); 
    }

    // NAVEGAÇÃO LATERAL (HUD)
    const menuItems = [
        { id: 'dashboard', label: 'Painel Central', icon: 'dashboard' },
        { id: 'budget', label: 'Matriz Orçamentária', icon: 'wallet' },
        { id: 'simulation', label: 'Simulador VR', icon: 'target' },
    ];

    return (
        <div className="flex h-screen bg-[#030305] text-[#f8fafc] font-sans overflow-hidden">
            {/* Efeitos de Luz no Fundo */}
            <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* SIDEBAR (HUD Esquerdo) */}
            <aside className="hidden md:flex w-[280px] flex-col bg-[#0a0a0c]/80 backdrop-blur-md border-r border-[#ffffff]/5 z-20">
                <div className="p-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-transparent border border-[#00f0ff] rounded-xl flex items-center justify-center text-[#00f0ff] shadow-neon">
                        <Icon name="terminal" size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-widest text-neon">NEXUS</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => { setView(item.id); setSimIncomes([]); setSimExpenses([]); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium tracking-wide ${view === item.id ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'text-[#64748b] hover:text-[#00f0ff] hover:bg-[#ffffff]/5'}`}>
                            <Icon name={item.icon} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-6 mt-auto">
                    <div className="p-3 bg-[#ffffff]/5 rounded-xl border border-[#ffffff]/5 flex items-center justify-between mb-4">
                        <div className="overflow-hidden">
                            <p className="text-xs font-mono text-[#00f0ff] truncate">{user.email?.split('@')[0]}</p>
                            <p className="text-[10px] text-[#64748b] uppercase mt-0.5">Operador Ativo</p>
                        </div>
                        <button onClick={() => window.firebase.auth().signOut()} className="p-2 text-[#ff0055] hover:bg-[#ff0055]/10 rounded-lg transition"><Icon name="log-out" size={16} /></button>
                    </div>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <main className="flex-1 flex flex-col h-full relative z-10">
                {/* Header Mobile */}
                <header className="md:hidden h-20 glass-panel border-b border-[#ffffff]/5 flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border border-[#00f0ff] rounded flex items-center justify-center text-[#00f0ff] shadow-neon"><Icon name="terminal" size={16}/></div>
                        <span className="font-bold tracking-widest text-neon text-sm">NEXUS</span>
                    </div>
                </header>

                {/* Conteúdo Dinâmico */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar scroll-smooth relative">
                    {isSimulation && <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/50 text-[#00f0ff] px-4 py-3 rounded-xl mb-6 text-center font-mono text-sm tracking-wide shadow-neon animate-pulse-slow">Aviso: Ambiente de Simulação VR Ativo.</div>}
                    {error && <div className="bg-[#ff0055]/10 border border-[#ff0055]/50 text-[#ff0055] px-4 py-3 rounded-xl mb-6 font-mono text-sm">{error}</div>}
                    {success && <div className="bg-[#00f0ff]/10 border border-[#00f0ff]/50 text-[#00f0ff] px-4 py-3 rounded-xl mb-6 font-mono text-sm shadow-neon">{success}</div>}

                    {isBudget ? (
                        <OrcamentoPage initialIncome={liquidityAnalysis.displayValue} />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                            {/* Esquerda: Relatórios e Gráficos */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="glass-panel p-6 rounded-2xl">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                        <h2 className="text-xl font-medium tracking-wide">Status do Sistema ({filterYear})</h2>
                                        <input type="number" value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))} className="w-24 bg-[#030305] border border-[#ffffff]/10 text-center rounded px-2 py-1 outline-none focus:border-[#00f0ff] font-mono text-sm"/>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-5 rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/5 shadow-neon relative overflow-hidden">
                                            <p className="text-xs text-[#00f0ff]/70 font-mono mb-2 uppercase">Capacidade Liquida</p>
                                            <h3 className="text-3xl font-bold text-[#00f0ff]">{liquidityAnalysis.displayValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                                            <div className="absolute -right-4 -bottom-4 opacity-10 text-[#00f0ff]"><Icon name="wallet" size={100}/></div>
                                        </div>
                                        <div className="p-5 rounded-xl border border-[#ffffff]/10 bg-[#ffffff]/5">
                                            <p className="text-xs text-[#64748b] font-mono mb-2 uppercase">Reserva Crítica</p>
                                            <h3 className="text-3xl font-bold text-white">{finalStabilityReserve.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-8 h-72 border border-[#ffffff]/5 rounded-xl bg-[#030305]/50 flex items-center justify-center">
                                        <p className="text-[#64748b] font-mono text-sm text-center">Gráfico de Telemetria<br/>(Renderizado via componente externo)</p>
                                    </div>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl">
                                    <div className="flex gap-4 border-b border-[#ffffff]/5 pb-4 mb-4">
                                        <button onClick={() => setActiveTab('incomes')} className={`text-sm font-medium tracking-wide px-3 py-1 transition ${activeTab === 'incomes' ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] text-neon' : 'text-[#64748b] hover:text-white'}`}>Entradas</button>
                                        <button onClick={() => setActiveTab('expenses')} className={`text-sm font-medium tracking-wide px-3 py-1 transition ${activeTab === 'expenses' ? 'text-[#ff0055] border-b-2 border-[#ff0055]' : 'text-[#64748b] hover:text-white'}`}>Saídas</button>
                                    </div>
                                    {activeTab === 'incomes' && <RecordsTable title="Entradas" records={sortedFilteredIncomes} onDelete={handleDeleteRecord} onEdit={(r) => setEditingRecord({...r, type: 'income'})} type="income" sortConfig={sortConfigs.incomes} requestSort={(key) => handleRequestSort('incomes', key)} isSimulation={isSimulation} participants={participants} />}
                                    {activeTab === 'expenses' && <RecordsTable title="Saídas" records={sortedFilteredExpenses} onDelete={handleDeleteRecord} onEdit={(r) => setEditingRecord({...r, type: 'expense'})} type="expense" sortConfig={sortConfigs.expenses} requestSort={(key) => handleRequestSort('expenses', key)} isSimulation={isSimulation} />}
                                </div>
                            </div>

                            {/* Direita: Inserção de Dados */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="glass-panel p-6 rounded-2xl lg:sticky lg:top-4">
                                    <h3 className="text-lg font-medium tracking-wide mb-6 uppercase border-b border-[#ffffff]/5 pb-2 text-[#00f0ff]">Input de Dados</h3>
                                    
                                    <div className="flex bg-[#030305] p-1 rounded-lg mb-6 border border-[#ffffff]/5">
                                        <button onClick={() => setFormType('income')} className={`flex-1 py-2 text-xs font-bold tracking-wider rounded ${formType === 'income' ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30' : 'text-[#64748b]'}`}>RECEITA</button>
                                        <button onClick={() => setFormType('expense')} className={`flex-1 py-2 text-xs font-bold tracking-wider rounded ${formType === 'expense' ? 'bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/30' : 'text-[#64748b]'}`}>DESPESA</button>
                                    </div>

                                    <form onSubmit={handleAddRecord} className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Identificador</label>
                                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded focus:border-[#00f0ff] outline-none transition" placeholder="Ex: Salário" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Volume (R$)</label>
                                            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded focus:border-[#00f0ff] outline-none transition font-mono" placeholder="0.00" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Ciclo</label>
                                                <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded outline-none">{Array.from({length: 12}, (_, i) => <option key={i} value={i}>{i+1}</option>)}</select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Ano</label>
                                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded outline-none font-mono"/>
                                            </div>
                                        </div>
                                        <button type="submit" className={`w-full py-3 mt-4 rounded font-bold tracking-widest text-xs uppercase transition border ${formType === 'income' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/50 hover:bg-[#00f0ff]/20 hover:shadow-neon' : 'bg-[#ff0055]/10 text-[#ff0055] border-[#ff0055]/50 hover:bg-[#ff0055]/20 hover:shadow-[0_0_15px_rgba(255,0,85,0.3)]'}`}>
                                            Executar Transação
                                        </button>
                                    </form>

                                    <div className="mt-8 pt-6 border-t border-[#ffffff]/5">
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={handleImportClick} className="py-2 text-[10px] font-mono uppercase text-[#64748b] border border-[#ffffff]/5 hover:border-[#00f0ff]/50 hover:text-[#00f0ff] rounded transition">Importar SYS</button>
                                            <button onClick={handleExportData} className="py-2 text-[10px] font-mono uppercase text-[#64748b] border border-[#ffffff]/5 hover:border-[#00f0ff]/50 hover:text-[#00f0ff] rounded transition">Exportar SYS</button>
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navbar Mobile (Bottom) */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-[#ffffff]/5 flex justify-around p-2 z-30">
                    {menuItems.map(item => (
                        <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-col items-center p-3 rounded-lg ${view === item.id ? 'text-[#00f0ff] text-neon' : 'text-[#64748b]'}`}><Icon name={item.icon} size={24} /></button>
                    ))}
                </nav>
            </main>

            {editingRecord && <EditModal record={editingRecord} onSave={handleUpdateRecord} onCancel={() => setEditingRecord(null)} onError={setError} participants={participants} />}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
