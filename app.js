const { useState, useEffect, useMemo, useRef, useCallback } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell } = Recharts;

// Importa componentes do escopo global
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

// Importa configuração do Firebase
const { app, db, auth, appId } = window.firebaseApp;

// --- NOVO SISTEMA DE ÍCONES (VISUAL CLEAN/FUTURISTA) ---
const Icon = ({ name, size = 20, className = "" }) => {
    const icons = {
        'dashboard': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
        'wallet': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>,
        'target': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
        'log-out': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
        'terminal': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>,
        'settings': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
        'import': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
        'export': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
        'undo': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>,
        'redo': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>,
        'help': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
        'calculator': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
        'reset': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
    };
    return icons[name] || null;
};

// Hook personalizado para ordenação
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

// --- COMPONENTE PRINCIPAL ---
function App() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [simIncomes, setSimIncomes] = useState([]);
    const [simExpenses, setSimExpenses] = useState([]);
    const [view, setView] = useState('dashboard'); 
    
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
    const [showDepletionModal, setShowDepletionModal] = useState(false);
    const [showRedoButton, setShowRedoButton] = useState(false);
    const [showLeanCalculator, setShowLeanCalculator] = useState(false);
    const [showAdjustReserveModal, setShowAdjustReserveModal] = useState(false);

    const isSimulation = view === 'simulation';
    const isBudget = view === 'budget';
    const participants = useMemo(() => userProfile?.participants || ['Eu'], [userProfile]);

    // LÓGICA CORE DE DADOS
    useEffect(() => {
        const unsubscribe = window.firebase.onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (!user) { setIsLoading(false); setDataLoaded(false); }
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
        const unsubIncomes = window.firebase.onSnapshot(incomesCol, (snapshot) => {
            const incomeData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setIncomes(incomeData);
            if (!dataLoaded) setDataLoaded(true);
        });

        const expensesCol = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`);
        const unsubExpenses = window.firebase.onSnapshot(expensesCol, (snapshot) => {
            const expenseData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setExpenses(expenseData);
            if (!dataLoaded) setDataLoaded(true);
        });
        
        return () => { unsubProfile(); unsubIncomes(); unsubExpenses(); };
    }, [user, dataLoaded]); 
    
    // --- FUNÇÕES DE AÇÃO (Handlers MANTIDOS DO ORIGINAL) ---
    const handleTourClose = async () => {
        setIsTourOpen(false);
        if (user && userProfile && !userProfile.tourCompleted) {
            const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
            await window.firebase.setDoc(profileRef, { tourCompleted: true }, { merge: true });
            if (incomes.length === 0 && expenses.length === 0 && !userProfile.initialDataSeeded) setShowOnboarding(true);
        }
    };

    const handleSaveParticipants = async (newParticipants) => {
        if (user) {
            try {
                const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
                await window.firebase.setDoc(profileRef, { participants: newParticipants }, { merge: true });
                setSuccess("Participantes atualizados com sucesso!");
                if (!newParticipants.includes(responsible)) setResponsible(newParticipants[0] || 'Eu');
            } catch (error) { setError("Erro ao salvar participantes."); }
        }
    };
    
    useEffect(() => {
        if (userProfile && dataLoaded) {
            const hasOnlySeedData = userProfile.initialDataSeeded && incomes.length > 0 && incomes.every(inc => inc.description.startsWith('Média inicial')) && expenses.length === 0;
            const hasNoData = userProfile.initialDataSeeded && incomes.length === 0 && expenses.length === 0;
            setShowRedoButton(hasOnlySeedData || hasNoData);
        } else { setShowRedoButton(false); }
    }, [incomes, expenses, userProfile, dataLoaded]);

    useEffect(() => { if (error) { const timer = setTimeout(() => setError(''), 5000); return () => clearTimeout(timer); } }, [error]);
    useEffect(() => { if (success) { const timer = setTimeout(() => setSuccess(''), 5000); return () => clearTimeout(timer); } }, [success]);
    
    const addActionToHistory = useCallback((action) => {
        if(isSimulation) return;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(action);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex, isSimulation]);

    const handleAddRecord = async (e) => { 
        e.preventDefault(); 
        if (!description.trim() || amount === '' || amount === null || isNaN(parseFloat(amount))) { setError("Preencha descrição e valor."); return; } 
        setError(''); 
        const currentResponsible = participants.length > 1 ? responsible : participants[0];
        const newRecord = { description, amount: parseFloat(amount), responsible: currentResponsible, month: parseInt(month), year: parseInt(year), createdAt: new Date() }; 
        if(isSimulation){ 
            const simId = `sim-${Date.now()}`; 
            const recordWithSimFlag = {...newRecord, id: simId, isSimulated: true}; 
            if (formType === 'income') setSimIncomes(prev => [...prev, recordWithSimFlag]); else setSimExpenses(prev => [...prev, recordWithSimFlag]); 
            setSuccess("Transação simulada adicionada."); 
        } else { 
            if (!db || !user) { setError("Erro de banco de dados."); return; } 
            const collectionName = formType === 'income' ? 'incomes' : 'expenses'; 
            try { 
                const colRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`); 
                const docRef = await window.firebase.addDoc(colRef, newRecord); 
                addActionToHistory({ type: 'ADD', collection: collectionName, docId: docRef.id, data: newRecord }); 
                setSuccess(`${formType === 'income' ? 'Entrada' : 'Saída'} adicionada com sucesso!`); 
            } catch (err) { setError("Ocorreu um erro ao salvar o registro."); } 
        } 
        setDescription(''); setAmount(''); 
    };

    const handleDeleteRecord = async (id, type) => { 
        if(isSimulation){ if(type === 'income') setSimIncomes(prev => prev.filter(r => r.id !== id)); else setSimExpenses(prev => prev.filter(r => r.id !== id)); return; } 
        if (!db || !user) return; 
        const collectionName = type === 'income' ? 'incomes' : 'expenses'; 
        const recordToDelete = (type === 'income' ? incomes : expenses).find(r => r.id === id); 
        if (!recordToDelete) return; 
        try { 
            const docRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`, id); 
            await window.firebase.deleteDoc(docRef); 
            addActionToHistory({ type: 'DELETE', collection: collectionName, docId: id, data: recordToDelete }); 
            setSuccess("Registro apagado com sucesso."); 
        } catch (err) { setError("Ocorreu um erro ao apagar o registro."); } 
    };

    const handleUpdateRecord = async (id, type, updatedData) => { 
        if(isSimulation){ const updateSim = (prev) => prev.map(r => r.id === id ? updatedData : r); if(type === 'income') setSimIncomes(updateSim); else setSimExpenses(updateSim); setEditingRecord(null); return; } 
        if (!db || !user) return; 
        const collectionName = type === 'income' ? 'incomes' : 'expenses'; 
        const originalRecord = (type === 'income' ? incomes : expenses).find(r => r.id === id); 
        try { 
            const {isSimulated, id: recordId, ...dataToSave} = updatedData; 
            const docRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`, id); 
            await window.firebase.updateDoc(docRef, dataToSave); 
            addActionToHistory({ type: 'UPDATE', collection: collectionName, docId: id, oldData: { description: originalRecord.description, amount: originalRecord.amount }, newData: dataToSave }); 
            setEditingRecord(null); setSuccess("Registro atualizado com sucesso."); 
        } catch (err) { setError("Ocorreu um erro ao atualizar o registro."); } 
    };

    const handleUndo = async () => { 
        if (historyIndex < 0 || isSimulation) return; 
        const actionToUndo = history[historyIndex]; 
        const { type, collection: collectionName, docId, data, oldData } = actionToUndo; 
        try { 
            const docRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`, docId); 
            if (type === 'ADD') { await window.firebase.deleteDoc(docRef); } 
            else if (type === 'DELETE') { const { id, ...dataToRestore } = data; await window.firebase.setDoc(docRef, dataToRestore); } 
            else if (type === 'UPDATE') { await window.firebase.updateDoc(docRef, oldData); } 
            setHistoryIndex(prev => prev - 1); setSuccess("Ação desfeita com sucesso."); 
        } catch (err) { setError("Falha ao desfazer a ação."); } 
    };

    const handleRedo = async () => { 
        if (historyIndex >= history.length - 1 || isSimulation) return; 
        const newIndex = historyIndex + 1; 
        const actionToRedo = history[newIndex]; 
        const { type, collection: collectionName, docId, data, newData } = actionToRedo; 
        try { 
            const docRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`, docId); 
            if (type === 'ADD') { await window.firebase.setDoc(docRef, data); } 
            else if (type === 'DELETE') { await window.firebase.deleteDoc(docRef); } 
            else if (type === 'UPDATE') { await window.firebase.updateDoc(docRef, newData); } 
            setHistoryIndex(newIndex); setSuccess("Ação refeita com sucesso."); 
        } catch (err) { setError("Falha ao refazer a ação."); } 
    };

    const handleExportData = () => { 
        if (incomes.length === 0 && expenses.length === 0) { setError("Não há dados para exportar."); return; } 
        const convertTimestamp = (data) => data.map(doc => { const { id, ...rest } = doc; if (rest.createdAt && typeof rest.createdAt.toDate === 'function') { rest.createdAt = rest.createdAt.toDate().toISOString(); } return rest; }); 
        const dataToExport = { incomes: convertTimestamp(incomes), expenses: convertTimestamp(expenses) }; 
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`; 
        const link = document.createElement("a"); link.href = jsonString; link.download = `dados_financeiros_${new Date().toISOString().slice(0, 10)}.json`; link.click(); 
        setSuccess('Dados exportados com sucesso!'); 
    };

    const handleImportClick = () => { fileInputRef.current.click(); };
    const handleFileChange = async (event) => { 
        const file = event.target.files[0]; if (!file) return; 
        if (file.type !== "application/json") { setError("Por favor, selecione um arquivo .json válido."); return; } 
        const reader = new FileReader(); 
        reader.onload = async (e) => { 
            try { 
                const data = JSON.parse(e.target.result); 
                setIsLoading(true); 
                const createRecordIdentifier = (rec) => { const date = rec.createdAt?.toDate ? rec.createdAt.toDate() : new Date(rec.createdAt); return `${rec.description?.trim()}|${rec.amount}|${date.toISOString()}`; }; 
                const existingIncomes = new Set(incomes.map(createRecordIdentifier)); 
                const existingExpenses = new Set(expenses.map(createRecordIdentifier)); 
                let importedCount = 0; let skippedCount = 0; 
                const incomeCollectionRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`); 
                for (const record of data.incomes) { const newRecord = { ...record, createdAt: record.createdAt ? new Date(record.createdAt) : new Date() }; const identifier = createRecordIdentifier(newRecord); if (!existingIncomes.has(identifier)) { await window.firebase.addDoc(incomeCollectionRef, newRecord); importedCount++; } else { skippedCount++; } } 
                const expenseCollectionRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`); 
                for (const record of data.expenses) { const newRecord = { ...record, createdAt: record.createdAt ? new Date(record.createdAt) : new Date() }; const identifier = createRecordIdentifier(newRecord); if (!existingExpenses.has(identifier)) { await window.firebase.addDoc(expenseCollectionRef, newRecord); importedCount++; } else { skippedCount++; } } 
                setSuccess(`Importação concluída! ${importedCount} novos, ${skippedCount} ignorados.`); 
                setHistory([]); setHistoryIndex(-1); 
            } catch (err) { setError(`Erro ao importar dados: ${err.message}`); } finally { if(fileInputRef.current) { fileInputRef.current.value = ""; } setIsLoading(false); } 
        }; 
        reader.readAsText(file); 
    };

    const handleRequestSort = (tab, key) => { setSortConfigs(prevConfigs => { const currentConfig = prevConfigs[tab]; let direction = 'ascending'; if (currentConfig.key === key && currentConfig.direction === 'ascending') { direction = 'descending'; } return { ...prevConfigs, [tab]: { key, direction } }; }); };
    
    const handleSaveInitialAverage = async (avg, months) => {
         if (user) {
            const incomesColRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`);
            const promises = [];
            const currentDate = new Date();
            for (let i = 0; i < months; i++) {
                const pastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i + 1), 1);
                const seedRecord = { description: `Média inicial (Mês ${i + 1}/${months})`, amount: avg, month: pastDate.getMonth(), year: pastDate.getFullYear(), createdAt: new Date() };
                promises.push(window.firebase.addDoc(incomesColRef, seedRecord));
            }
            try {
                await Promise.all(promises);
                const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
                await window.firebase.setDoc(profileRef, { initialDataSeeded: true, tourCompleted: true }, { merge: true });
                setShowOnboarding(false);
            } catch (err) { setError("Não foi possível salvar os dados iniciais. Tente novamente."); }
        }
    };
    
    const handleStartFromZero = async () => { if(user) { const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`); await window.firebase.setDoc(profileRef, { initialDataSeeded: true, tourCompleted: true }, { merge: true }); setShowOnboarding(false); } };

    const handleRedoInitialAverage = async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const seedRecords = incomes.filter(inc => inc.description.startsWith('Média inicial'));
            const deletePromises = seedRecords.map(record => window.firebase.deleteDoc(window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/incomes`, record.id)));
            await Promise.all(deletePromises);
            const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
            await window.firebase.setDoc(profileRef, { initialDataSeeded: false }, { merge: true });
        } catch (err) { setError("Ocorreu um erro ao reiniciar a configuração."); } finally { setIsLoading(false); }
    };

    const handleManualReserveAdjustment = async (userInputValue, adjustmentType) => {
        if (!user) return;
        if (userInputValue === 0) {
             if (!confirm("Tem certeza que deseja zerar? Isso apagará todos os históricos de ajustes manuais e resgates de reserva para reiniciar a contagem.")) return;
             try {
                 setIsLoading(true);
                 const recordsToDelete = [];
                 incomes.forEach(doc => { if (doc.isReserveAdjustment || doc.isTransferFromReserve) recordsToDelete.push({ col: 'incomes', id: doc.id }); });
                 expenses.forEach(doc => { if (doc.isReserveAdjustment) recordsToDelete.push({ col: 'expenses', id: doc.id }); });
                 await Promise.all(recordsToDelete.map(r => window.firebase.deleteDoc(window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${r.col}`, r.id))));
                 setSuccess("Histórico de ajustes e resgates reiniciado.");
                 setShowAdjustReserveModal(false);
             } catch (err) { setError("Erro ao reiniciar reserva."); } finally { setIsLoading(false); }
             return;
        }

        const currentDate = new Date();
        const now = new Date();
        const currentMonthBalance = filteredIncomes.filter(i => i.month === now.getMonth() && i.year === now.getFullYear()).reduce((sum, i) => sum + i.amount, 0) - filteredExpenses.filter(e => e.month === now.getMonth() && e.year === now.getFullYear()).reduce((sum, e) => sum + e.amount, 0);
        const suggested = calculateMovingAverage(now.getFullYear(), now.getMonth());
        const deficit = Math.max(0, suggested - currentMonthBalance);
        let incomeToAdd = deficit > 0 ? deficit : 0;

        try {
            if (incomeToAdd > 0) {
                const incomeRecord = { description: "Resgate da Reserva (Cobrir Meta)", amount: incomeToAdd, month: currentDate.getMonth(), year: currentDate.getFullYear(), createdAt: new Date(), isReserveAdjustment: false, isTransferFromReserve: true };
                const docRef = await window.firebase.addDoc(window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`), incomeRecord);
                addActionToHistory({ type: 'ADD', collection: 'incomes', docId: docRef.id, data: incomeRecord });
            }

            const adjustmentAmount = userInputValue - finalStabilityReserve - incomeToAdd;
            let collectionName = 'incomes';
            let finalAmount = adjustmentAmount;
            
            if (adjustmentAmount < 0) { collectionName = 'expenses'; finalAmount = Math.abs(adjustmentAmount); }
            
            const adjustmentRecord = { description: `Ajuste Manual (${adjustmentType === 'correction' ? 'Correção' : 'Movimentação'})`, amount: finalAmount, month: currentDate.getMonth(), year: currentDate.getFullYear(), createdAt: new Date(), isReserveAdjustment: true };
            const docRefAdj = await window.firebase.addDoc(window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`), adjustmentRecord);
            addActionToHistory({ type: 'ADD', collection: collectionName, docId: docRefAdj.id, data: adjustmentRecord });
            
            setSuccess("Reserva ajustada com sucesso!");
            setShowAdjustReserveModal(false);
        } catch (err) { setError("Erro ao salvar ajuste."); }
    };
    
    const handleLeanCalculatorApply = (withdrawalAmount) => {
         const performLeanUpdate = async () => {
             if (!user) return;
             try {
                const currentDate = new Date();
                const incomeRecord = { description: "Resgate (Vacas Magras)", amount: withdrawalAmount, month: currentDate.getMonth(), year: currentDate.getFullYear(), createdAt: new Date(), isReserveAdjustment: false, isTransferFromReserve: true };
                const incRef = await window.firebase.addDoc(window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`), incomeRecord);
                addActionToHistory({ type: 'ADD', collection: 'incomes', docId: incRef.id, data: incomeRecord });

                const adjustmentAmount = -2 * withdrawalAmount;
                const adjRecord = { description: "Saída p/ Cobertura (Vacas Magras)", amount: Math.abs(adjustmentAmount), month: currentDate.getMonth(), year: currentDate.getFullYear(), createdAt: new Date(), isReserveAdjustment: true };
                const expRef = await window.firebase.addDoc(window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`), adjRecord);
                addActionToHistory({ type: 'ADD', collection: 'expenses', docId: expRef.id, data: adjRecord });
                
                setSuccess("Plano de Vacas Magras aplicado!");
             } catch(err) { setError("Erro ao aplicar plano."); }
         };
         performLeanUpdate();
    };

    // --- LÓGICA MATEMÁTICA E CÁLCULOS RESTAURADOS ---
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

    const filteredIncomes = useMemo(() => combinedIncomes.filter(i => i.year === filterYear && !i.isReserveAdjustment && !i.isTransferFromReserve), [combinedIncomes, filterYear]);
    const reserveTransfers = useMemo(() => combinedIncomes.filter(i => i.year === filterYear && i.isTransferFromReserve), [combinedIncomes, filterYear]);
    const filteredExpenses = useMemo(() => combinedExpenses.filter(e => e.year === filterYear && !e.isReserveAdjustment), [combinedExpenses, filterYear]);
    
    const totalRealIncome = useMemo(() => filteredIncomes.reduce((sum, i) => sum + i.amount, 0), [filteredIncomes]);
    const totalTransfers = useMemo(() => reserveTransfers.reduce((sum, i) => sum + i.amount, 0), [reserveTransfers]);
    const totalAvailable = totalRealIncome + totalTransfers;
    const totalExpenses = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);
    const balance = useMemo(() => totalRealIncome - totalExpenses, [totalRealIncome, totalExpenses]);
    
    const calculateMovingAverage = useCallback((targetYear, targetMonth) => {
        const targetDate = new Date(targetYear, targetMonth, 1);
        const windowStart = new Date(targetDate);
        windowStart.setMonth(windowStart.getMonth() - 11);
        
        const relevantIncomes = combinedIncomes.filter(i => {
            const d = new Date(i.year, i.month, 1);
            return d >= windowStart && d <= targetDate && !i.isReserveAdjustment && !i.isTransferFromReserve;
        });
        const relevantExpenses = combinedExpenses.filter(e => {
            const d = new Date(e.year, e.month, 1);
            return d >= windowStart && d <= targetDate && !e.isReserveAdjustment;
        });
        
        const activeMonths = new Set([...relevantIncomes, ...relevantExpenses].map(t => `${t.year}-${t.month}`));
        const numMonthsWithData = activeMonths.size > 0 ? activeMonths.size : 1;
        
        const totalIncome = relevantIncomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        return (totalIncome - totalExpense) / numMonthsWithData;
    }, [combinedIncomes, combinedExpenses]);

    const calculateMovingIncomeAverage = useCallback((targetYear, targetMonth) => {
        const targetDate = new Date(targetYear, targetMonth, 1);
        const windowStart = new Date(targetDate);
        windowStart.setMonth(windowStart.getMonth() - 11);
        
        const relevantIncomes = combinedIncomes.filter(i => {
            const d = new Date(i.year, i.month, 1);
            return d >= windowStart && d <= targetDate && !i.isReserveAdjustment && !i.isTransferFromReserve;
        });
        const activeMonths = new Set([...relevantIncomes].map(t => `${t.year}-${t.month}`));
        const numMonthsWithData = activeMonths.size > 0 ? activeMonths.size : 1;
        
        const totalIncome = relevantIncomes.reduce((sum, i) => sum + i.amount, 0);
        return totalIncome / numMonthsWithData;
    }, [combinedIncomes]);

    const currentTwelveMonthAverage = useMemo(() => {
        return calculateMovingAverage(contextDate.getFullYear(), contextDate.getMonth());
    }, [calculateMovingAverage, contextDate]);

    const last12MonthsSummary = useMemo(() => {
        const windowStart = new Date(contextDate.getFullYear(), contextDate.getMonth() - 11, 1);
        const windowEnd = new Date(contextDate.getFullYear(), contextDate.getMonth() + 1, 0);
        
        const relevantIncomes = combinedIncomes.filter(i => {
            const d = new Date(i.year, i.month, 1);
            return d >= windowStart && d <= windowEnd && !i.isReserveAdjustment && !i.isTransferFromReserve;
        });
        const relevantExpenses = combinedExpenses.filter(e => {
            const d = new Date(e.year, e.month, 1);
            return d >= windowStart && d <= windowEnd && !e.isReserveAdjustment;
        });

        const activeMonths = new Set([...relevantIncomes, ...relevantExpenses].map(t => `${t.year}-${t.month}`));
        const numMonths = activeMonths.size > 0 ? activeMonths.size : 1;

        const totalIncome = relevantIncomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);

        return { avgIncome: totalIncome / numMonths, avgExpense: totalExpense / numMonths };
    }, [combinedIncomes, combinedExpenses, contextDate]);
    
    const contributionData = useMemo(() => {
        const windowStart = new Date(contextDate.getFullYear(), contextDate.getMonth() - 11, 1);
        const windowEnd = new Date(contextDate.getFullYear(), contextDate.getMonth() + 1, 0);
        const data = {};
        combinedIncomes.forEach(inc => {
            const d = new Date(inc.year, inc.month, 1);
             if (d >= windowStart && d <= windowEnd && !inc.isReserveAdjustment && !inc.isTransferFromReserve) {
                const who = inc.responsible || 'Eu';
                if (!data[who]) data[who] = 0;
                data[who] += inc.amount;
            }
        });
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [combinedIncomes, contextDate]);
    
    const individualAverages = useMemo(() => {
         const windowStart = new Date(contextDate.getFullYear(), contextDate.getMonth() - 11, 1);
         const windowEnd = new Date(contextDate.getFullYear(), contextDate.getMonth() + 1, 0);
         const grouping = {}; const activeMonthsPerPerson = {};
         combinedIncomes.forEach(inc => {
            const d = new Date(inc.year, inc.month, 1);
             if (d >= windowStart && d <= windowEnd && !inc.isReserveAdjustment && !inc.isTransferFromReserve) {
                const who = inc.responsible || 'Eu';
                if (!grouping[who]) grouping[who] = 0;
                grouping[who] += inc.amount;
                const monthKey = `${inc.year}-${inc.month}`;
                if (!activeMonthsPerPerson[who]) activeMonthsPerPerson[who] = new Set();
                activeMonthsPerPerson[who].add(monthKey);
            }
         });
         return Object.entries(grouping).map(([name, total]) => {
             const monthsActive = activeMonthsPerPerson[name] ? activeMonthsPerPerson[name].size : 1;
             return { name, avg: total / (monthsActive > 0 ? monthsActive : 1), monthsCount: monthsActive };
         });
    }, [combinedIncomes, contextDate]);

    const stabilityReserveHistory = useMemo(() => { 
        const monthlyNetIncomes = {}; 
        const adjustmentFlags = {};
        combinedIncomes.forEach(record => { 
            const key = `${record.year}-${String(record.month).padStart(2, '0')}`; 
            if (!monthlyNetIncomes[key]) monthlyNetIncomes[key] = 0; 
            monthlyNetIncomes[key] += record.amount; 
            if (record.isReserveAdjustment) adjustmentFlags[key] = true;
        }); 
        combinedExpenses.forEach(record => { 
            const key = `${record.year}-${String(record.month).padStart(2, '0')}`; 
            if (!monthlyNetIncomes[key]) monthlyNetIncomes[key] = 0; 
            monthlyNetIncomes[key] -= record.amount; 
            if (record.isReserveAdjustment) adjustmentFlags[key] = true;
        }); 
        
        const sortedMonthKeys = Object.keys(monthlyNetIncomes).sort(); 
        if (sortedMonthKeys.length === 0) { return []; } 
        
        const history = []; let runningReserve = 0; 
        
        for (const monthKey of sortedMonthKeys) { 
            const [currentYear, currentMonthIndex] = monthKey.split('-').map(Number); 
            const avgBalanceForThisMonth = calculateMovingAverage(currentYear, currentMonthIndex);
            const previousReserve = runningReserve; 
            const currentMonthBalance = monthlyNetIncomes[monthKey] || 0; 
            const difference = currentMonthBalance - avgBalanceForThisMonth; 
            runningReserve += difference; 
            if (runningReserve < 0) { runningReserve = 0; } 
            const amountAdded = runningReserve - previousReserve;
            const monthName = new Date(currentYear, currentMonthIndex).toLocaleString('pt-BR', { month: 'short' }).replace('.',''); 
            
            history.push({ monthKey: monthKey, monthName: monthName, amountAdded: amountAdded, totalReserve: runningReserve, movingAverageUsed: avgBalanceForThisMonth, hasAdjustment: adjustmentFlags[monthKey] }); 
        } 
        return history; 
    }, [combinedIncomes, combinedExpenses, calculateMovingAverage]);
    
    const finalStabilityReserve = useMemo(() => { return stabilityReserveHistory.length > 0 ? stabilityReserveHistory[stabilityReserveHistory.length - 1].totalReserve : 0; }, [stabilityReserveHistory]);
    
    const liquidityAnalysis = useMemo(() => {
        const now = isSimulation ? contextDate : new Date();
        const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth()).padStart(2, '0')}`;
        const prevReserveEntry = stabilityReserveHistory.find(h => h.monthKey === prevKey);
        const prevReserve = prevReserveEntry ? prevReserveEntry.totalReserve : 0;

        const currentMonthIncomes = combinedIncomes.filter(i => i.month === now.getMonth() && i.year === now.getFullYear() && !i.isReserveAdjustment && !i.isTransferFromReserve).reduce((sum, i) => sum + i.amount, 0);
        const currentMonthExpenses = combinedExpenses.filter(e => e.month === now.getMonth() && e.year === now.getFullYear() && !e.isReserveAdjustment).reduce((sum, e) => sum + e.amount, 0);

        const currentNetBalance = currentMonthIncomes - currentMonthExpenses;
        const totalLiquidity = currentNetBalance + prevReserve;
        const suggestion = currentTwelveMonthAverage;
        const isLimited = totalLiquidity < suggestion;

        return { isLimited, displayValue: isLimited ? totalLiquidity : suggestion, originalSuggestion: suggestion, totalLiquidity };
    }, [stabilityReserveHistory, combinedIncomes, combinedExpenses, currentTwelveMonthAverage, contextDate, isSimulation]);

    const monthlySummary = useMemo(() => { 
        const summary = Array.from({ length: 12 }, (_, i) => ({ month: i, monthName: new Date(filterYear, i).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''), income: 0, expense: 0, balance: 0, transfers: 0 })); 
        filteredIncomes.forEach(income => { summary[income.month].income += income.amount; }); 
        reserveTransfers.forEach(t => { summary[t.month].transfers += t.amount; });
        filteredExpenses.forEach(expense => { summary[expense.month].expense += expense.amount; }); 
        summary.forEach(monthData => { monthData.balance = monthData.income - monthData.expense; }); 
        return summary; 
    }, [filteredIncomes, reserveTransfers, filteredExpenses, filterYear]);
    
    const currentMonthIncomeForModal = useMemo(() => {
        const now = new Date();
        return filteredIncomes.filter(i => i.month === now.getMonth() && i.year === now.getFullYear()).reduce((sum, i) => sum + i.amount, 0);
    }, [filteredIncomes]);

    const currentMonthBalanceForModal = useMemo(() => {
        const now = new Date();
        const income = filteredIncomes.filter(i => i.month === now.getMonth() && i.year === now.getFullYear()).reduce((sum, i) => sum + i.amount, 0);
        const transfers = reserveTransfers.filter(i => i.month === now.getMonth() && i.year === now.getFullYear()).reduce((sum, i) => sum + i.amount, 0);
        const expense = filteredExpenses.filter(e => e.month === now.getMonth() && e.year === now.getFullYear()).reduce((sum, e) => sum + e.amount, 0);
        return (income + transfers) - expense;
    }, [filteredIncomes, reserveTransfers, filteredExpenses]);

    const chartData = useMemo(() => { 
        const data = [];
        const sortedHistory = [...stabilityReserveHistory].sort((a, b) => a.monthKey.localeCompare(b.monthKey));
        
        for (let i = 11; i >= 0; i--) {
            const d = new Date(contextDate.getFullYear(), contextDate.getMonth() - i, 1);
            const month = d.getMonth();
            const year = d.getFullYear();
            const monthKey = `${year}-${String(month).padStart(2, '0')}`;
            const label = d.toLocaleString('pt-BR', { month: 'short' }).replace('.','') + '/' + year.toString().slice(2);

            const income = combinedIncomes.filter(r => r.month === month && r.year === year && !r.isReserveAdjustment && !r.isTransferFromReserve).reduce((sum, r) => sum + r.amount, 0);
            const transfers = combinedIncomes.filter(r => r.month === month && r.year === year && r.isTransferFromReserve).reduce((sum, r) => sum + r.amount, 0);
            const expense = combinedExpenses.filter(r => r.month === month && r.year === year && !r.isReserveAdjustment).reduce((sum, r) => sum + r.amount, 0);
            
            const displayBalance = income - expense; 
            const saldoSugerido = calculateMovingAverage(year, month);
            const avgIncome = calculateMovingIncomeAverage(year, month);

            let reserveVal = 0;
            const relevantHistoryEntry = sortedHistory.filter(h => h.monthKey <= monthKey).pop();
            if (relevantHistoryEntry) { reserveVal = relevantHistoryEntry.totalReserve; }

            data.push({ monthName: label, balance: displayBalance, expense, saldoSugerido, avgIncome, stabilityReserve: reserveVal });
        }
        return data;
    }, [stabilityReserveHistory, combinedIncomes, combinedExpenses, calculateMovingAverage, calculateMovingIncomeAverage, contextDate]); 
    
    const monthlyBalanceHistory = useMemo(() => monthlySummary.filter(m => m.income > 0 || m.transfers > 0 || m.expense > 0), [monthlySummary]);
    
    const sortedMonthlyBalanceHistory = useSortableData(monthlyBalanceHistory, sortConfigs.summary);
    const sortedStabilityReserveHistory = useSortableData(stabilityReserveHistory, sortConfigs.reserve);

    const canUndo = historyIndex >= 0 && !isSimulation;
    const canRedo = historyIndex < history.length - 1 && !isSimulation;
    const tourSteps = [ { target: '#add-record-form', title: 'Bem-vindo(a)!', content: 'Use este formulário para adicionar entradas e saídas.' } ];

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

            {/* Modais Globais originais */}
            {showOnboarding && <OnboardingModal onSave={handleSaveInitialAverage} onCancel={handleStartFromZero} />}
            <LeanTimesCalculatorModal isOpen={showLeanCalculator} onClose={() => setShowLeanCalculator(false)} currentMonthIncome={currentMonthIncomeForModal} currentMonthBalance={currentMonthBalanceForModal} currentReserve={finalStabilityReserve} onApply={handleLeanCalculatorApply} />
            <AdjustReserveModal isOpen={showAdjustReserveModal} onClose={() => setShowAdjustReserveModal(false)} currentCalculatedReserve={finalStabilityReserve} onConfirm={handleManualReserveAdjustment} currentMonthBalance={currentMonthBalanceForModal} suggestedBalance={currentTwelveMonthAverage} />
            <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} participants={participants} onSaveParticipants={handleSaveParticipants} />
            <Tour steps={tourSteps} isOpen={isTourOpen} onClose={handleTourClose} />
            {editingRecord && <EditModal record={editingRecord} onSave={handleUpdateRecord} onCancel={() => { setEditingRecord(null); setError(''); }} onError={setError} participants={participants} />}

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
                    <button onClick={() => window.firebase.auth().signOut()} className="text-[#ff0055]"><Icon name="log-out" size={20}/></button>
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
                                <div id="summary-cards" className="glass-panel p-6 rounded-2xl">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                        <h2 className="text-xl font-medium tracking-wide">Resumo do Sistema ({filterYear})</h2>
                                        <input type="number" value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))} className="w-24 bg-[#030305] border border-[#ffffff]/10 text-center rounded px-2 py-1 outline-none focus:border-[#00f0ff] font-mono text-sm"/>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Card Saldo Sugerido */}
                                        <div className={`p-5 rounded-xl border ${liquidityAnalysis.isLimited ? 'border-[#ff0055]/50 bg-[#ff0055]/5 shadow-neon-pink' : 'border-[#00f0ff]/20 bg-[#00f0ff]/5 shadow-neon'} relative overflow-hidden group`}>
                                            <p className={`text-xs font-mono mb-2 uppercase flex items-center gap-2 ${liquidityAnalysis.isLimited ? 'text-[#ff0055]/80' : 'text-[#00f0ff]/70'}`}>
                                                {liquidityAnalysis.isLimited ? '⚠️ Capacidade Limitada' : '💡 Saldo Sugerido'}
                                            </p>
                                            <h3 className={`text-3xl font-bold ${liquidityAnalysis.isLimited ? 'text-[#ff0055]' : 'text-[#00f0ff]'}`}>
                                                {liquidityAnalysis.displayValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </h3>
                                            {liquidityAnalysis.isLimited && (
                                                <p className="text-[10px] text-[#ff0055]/60 mt-1 uppercase tracking-wider">Por Renda + Reserva</p>
                                            )}
                                        </div>

                                        {/* Card Reserva Crítica */}
                                        <div className="p-5 rounded-xl border border-[#ffffff]/10 bg-[#ffffff]/5 relative group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs text-[#64748b] font-mono mb-2 uppercase">Reserva Crítica</p>
                                                    <h3 className="text-3xl font-bold text-white">{finalStabilityReserve.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                                                </div>
                                                <button onClick={() => setShowAdjustReserveModal(true)} className="text-[#64748b] hover:text-[#00f0ff] transition p-2">
                                                    <Icon name="settings" size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão de Expandir Detalhes do Ano */}
                                    <div className="text-center mt-6 border-t border-[#ffffff]/10 pt-4">
                                        <button onClick={() => setShowFullSummary(!showFullSummary)} className="text-xs font-mono tracking-widest uppercase text-[#00f0ff] hover:text-white transition">
                                            {showFullSummary ? '[-] Ocultar Telemetria' : '[+] Expandir Telemetria'}
                                        </button>
                                    </div>

                                    {/* Detalhes do Ano (Aparecem ao clicar) */}
                                    {showFullSummary && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-fade-in border-t border-[#ffffff]/10 pt-6">
                                            <div className="bg-[#00f0ff]/5 p-4 rounded-xl border border-[#00f0ff]/20">
                                                <h3 className="text-xs font-mono text-[#00f0ff]/70 uppercase">Total Entradas</h3>
                                                <p className="text-xl font-bold text-[#00f0ff] mt-1">{totalRealIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            </div>
                                            <div className="bg-[#ff0055]/5 p-4 rounded-xl border border-[#ff0055]/20">
                                                <h3 className="text-xs font-mono text-[#ff0055]/70 uppercase">Total Saídas</h3>
                                                <p className="text-xl font-bold text-[#ff0055] mt-1">{totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            </div>
                                            <div className="bg-[#ffffff]/5 p-4 rounded-xl border border-[#ffffff]/10">
                                                <h3 className="text-xs font-mono text-[#64748b] uppercase">Média Entradas (12m)</h3>
                                                <p className="text-xl font-bold text-white mt-1">{last12MonthsSummary.avgIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            </div>
                                            <div className="bg-[#ffffff]/5 p-4 rounded-xl border border-[#ffffff]/10">
                                                <h3 className="text-xs font-mono text-[#64748b] uppercase">Média Saídas (12m)</h3>
                                                <p className="text-xl font-bold text-white mt-1">{last12MonthsSummary.avgExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            </div>
                                            <div className={`md:col-span-2 p-4 rounded-xl border ${balance >= 0 ? 'bg-[#00f0ff]/5 border-[#00f0ff]/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                                                <h3 className={`text-xs font-mono uppercase ${balance >= 0 ? 'text-[#00f0ff]/70' : 'text-yellow-500/70'}`}>Saldo Final Disponível</h3>
                                                <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-[#00f0ff]' : 'text-yellow-500'}`}>{balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Gráfico de Evolução Restaurado */}
                                <div className="mt-8 glass-panel p-4 sm:p-6 rounded-2xl">
                                    <h3 className="text-lg font-medium tracking-wide mb-4 text-white">Evolução Financeira</h3>
                                    <div className="h-80 w-full">
                                        <FinancialEvolutionChart data={chartData} />
                                    </div>
                                </div>

                                {/* Tabelas Detalhadas */}
                                <div id="detailed-reports" className="glass-panel p-6 rounded-2xl">
                                    <div className="flex flex-wrap gap-4 border-b border-[#ffffff]/5 pb-4 mb-4">
                                        <button onClick={() => setActiveTab('summary')} className={`text-sm font-medium tracking-wide px-3 py-1 transition ${activeTab === 'summary' ? 'text-white border-b-2 border-white' : 'text-[#64748b] hover:text-white'}`}>Resumo</button>
                                        <button onClick={() => setActiveTab('reserve')} className={`text-sm font-medium tracking-wide px-3 py-1 transition ${activeTab === 'reserve' ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] text-neon' : 'text-[#64748b] hover:text-white'}`}>Reserva</button>
                                        <button onClick={() => setActiveTab('incomes')} className={`text-sm font-medium tracking-wide px-3 py-1 transition ${activeTab === 'incomes' ? 'text-[#00f0ff] border-b-2 border-[#00f0ff] text-neon' : 'text-[#64748b] hover:text-white'}`}>Entradas</button>
                                        <button onClick={() => setActiveTab('expenses')} className={`text-sm font-medium tracking-wide px-3 py-1 transition ${activeTab === 'expenses' ? 'text-[#ff0055] border-b-2 border-[#ff0055]' : 'text-[#64748b] hover:text-white'}`}>Saídas</button>
                                        {participants.length > 1 && (
                                            <button onClick={() => setActiveTab('couple')} className={`text-sm font-medium tracking-wide px-3 py-1 transition ${activeTab === 'couple' ? 'text-white border-b-2 border-white' : 'text-[#64748b] hover:text-white'}`}>Casal</button>
                                        )}
                                    </div>
                                    <div className="mt-4 overflow-x-auto custom-scrollbar">
                                        {activeTab === 'summary' && <MonthlyBalanceHistoryTable data={sortedMonthlyBalanceHistory} isLoading={isLoading} sortConfig={sortConfigs.summary} requestSort={(key) => handleRequestSort('summary', key)} />}
                                        {activeTab === 'reserve' && <StabilityReserveHistoryTable data={sortedStabilityReserveHistory} sortConfig={sortConfigs.reserve} requestSort={(key) => handleRequestSort('reserve', key)} />}
                                        {activeTab === 'incomes' && <RecordsTable title={`Entradas (${filterYear})`} records={sortedFilteredIncomes} onDelete={handleDeleteRecord} onEdit={(r) => setEditingRecord({...r, type: 'income'})} type="income" sortConfig={sortConfigs.incomes} requestSort={(key) => handleRequestSort('incomes', key)} isSimulation={isSimulation} participants={participants} />}
                                        {activeTab === 'expenses' && <RecordsTable title={`Saídas (${filterYear})`} records={sortedFilteredExpenses} onDelete={handleDeleteRecord} onEdit={(r) => setEditingRecord({...r, type: 'expense'})} type="expense" sortConfig={sortConfigs.expenses} requestSort={(key) => handleRequestSort('expenses', key)} isSimulation={isSimulation} />}
                                        {activeTab === 'couple' && participants.length > 1 && <ContributionAnalysis contributionData={contributionData} individualAverages={individualAverages} />}
                                    </div>
                                </div>
                            </div>

                            {/* Direita: Inserção de Dados */}
                            <div className="lg:col-span-4 space-y-6">
                                <div id="add-record-form" className="glass-panel p-6 rounded-2xl lg:sticky lg:top-4">
                                    <h3 className="text-lg font-medium tracking-wide mb-6 uppercase border-b border-[#ffffff]/5 pb-2 text-[#00f0ff]">Input de Dados</h3>
                                    
                                    <div className="flex bg-[#030305] p-1 rounded-lg mb-6 border border-[#ffffff]/5">
                                        <button onClick={() => setFormType('income')} className={`flex-1 py-2 text-xs font-bold tracking-wider rounded transition ${formType === 'income' ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 shadow-neon' : 'text-[#64748b] hover:text-white'}`}>RECEITA</button>
                                        <button onClick={() => setFormType('expense')} className={`flex-1 py-2 text-xs font-bold tracking-wider rounded transition ${formType === 'expense' ? 'bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/30' : 'text-[#64748b] hover:text-white'}`}>DESPESA</button>
                                    </div>

                                    <form onSubmit={handleAddRecord} className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Identificador</label>
                                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded focus:border-[#00f0ff] outline-none transition" placeholder={formType === 'income' ? 'Ex: Salário' : 'Ex: Aluguel'} />
                                        </div>
                                        {participants.length > 1 && (
                                            <div>
                                                <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Responsável</label>
                                                <input list="resp-options" value={responsible} onChange={(e) => setResponsible(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded focus:border-[#00f0ff] outline-none transition" placeholder="Quem?" />
                                                <datalist id="resp-options">{participants.map(p => <option key={p} value={p}>{p}</option>)}</datalist>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Volume (R$)</label>
                                            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded focus:border-[#00f0ff] outline-none transition font-mono" placeholder="0.00" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] text-[#64748b] font-mono uppercase mb-1 block">Ciclo</label>
                                                <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-[#030305] border border-[#ffffff]/10 text-white px-3 py-2.5 rounded outline-none">{Array.from({length: 12}, (_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>)}</select>
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

                                    {/* Ferramentas Restauradas */}
                                    <div id="action-buttons" className="mt-8 pt-6 border-t border-[#ffffff]/5">
                                        <h4 className="text-[10px] font-mono uppercase text-[#64748b] mb-3">Sistemas Auxiliares</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => setShowLeanCalculator(true)} className="col-span-2 py-2 text-[10px] font-mono uppercase text-[#64748b] border border-[#ffffff]/5 hover:border-yellow-500/50 hover:text-yellow-500 bg-[#030305] rounded transition flex items-center justify-center gap-2"><Icon name="calculator"/> Modo Vacas Magras</button>
                                            
                                            {showRedoButton && (
                                                <button onClick={handleRedoInitialAverage} className="col-span-2 py-2 text-[10px] font-mono uppercase text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 rounded transition flex items-center justify-center gap-2"><Icon name="reset"/> Refazer Média Inicial</button>
                                            )}

                                            <button onClick={handleImportClick} disabled={isSimulation} className="py-2 text-[10px] font-mono uppercase text-[#64748b] border border-[#ffffff]/5 hover:border-[#00f0ff]/50 hover:text-[#00f0ff] bg-[#030305] rounded transition disabled:opacity-30 flex items-center justify-center gap-1"><Icon name="import"/> Importar</button>
                                            <button onClick={handleExportData} disabled={isSimulation} className="py-2 text-[10px] font-mono uppercase text-[#64748b] border border-[#ffffff]/5 hover:border-[#00f0ff]/50 hover:text-[#00f0ff] bg-[#030305] rounded transition disabled:opacity-30 flex items-center justify-center gap-1"><Icon name="export"/> Exportar</button>
                                            
                                            <button onClick={handleUndo} disabled={!canUndo} className="py-2 text-[10px] font-mono uppercase text-[#64748b] border border-[#ffffff]/5 hover:border-white/50 hover:text-white bg-[#030305] rounded transition disabled:opacity-30 flex items-center justify-center gap-1"><Icon name="undo"/> Desfazer</button>
                                            <button onClick={handleRedo} disabled={!canRedo} className="py-2 text-[10px] font-mono uppercase text-[#64748b] border border-[#ffffff]/5 hover:border-white/50 hover:text-white bg-[#030305] rounded transition disabled:opacity-30 flex items-center justify-center gap-1"><Icon name="redo"/> Refazer</button>
                                            
                                            <button onClick={() => setIsTourOpen(true)} className="col-span-2 py-2 text-[10px] font-mono uppercase text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 rounded transition flex items-center justify-center gap-2 mt-2"><Icon name="help"/> Tour Guiado</button>
                                            
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
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
