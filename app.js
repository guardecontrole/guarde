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

// Importa ícones
const icons = window.icons;

// Importa configuração do Firebase
const { app, db, auth, appId } = window.firebaseApp;

// Importa constantes
const COLORS = window.COLORS;

// Hook personalizado para ordenação
const useSortableData = (items, config) => { 
    return useMemo(() => { 
        if (!config) return items; 
        const sortedItems = [...items]; 
        sortedItems.sort((a, b) => { 
            if (a[config.key] < b[config.key]) { 
                return config.direction === 'ascending' ? -1 : 1; 
            } 
            if (a[config.key] > b[config.key]) { 
                return config.direction === 'ascending' ? 1 : -1; 
            } 
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
    const [sortConfigs, setSortConfigs] = useState({ 
        summary: { key: 'month', direction: 'descending' }, 
        reserve: { key: 'monthKey', direction: 'descending' }, 
        incomes: { key: 'month', direction: 'descending' }, 
        expenses: { key: 'month', direction: 'descending' } 
    });
    const [showFullSummary, setShowFullSummary] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showDepletionModal, setShowDepletionModal] = useState(false);
    const [depletionModalShownThisSession, setDepletionModalShownThisSession] = useState(false);
    const [showRedoButton, setShowRedoButton] = useState(false);
    const [showLeanCalculator, setShowLeanCalculator] = useState(false);
    const [showAdjustReserveModal, setShowAdjustReserveModal] = useState(false);

    const isSimulation = view === 'simulation';
    const isBudget = view === 'budget';
    const participants = useMemo(() => userProfile?.participants || ['Eu'], [userProfile]);

    useEffect(() => {
        const unsubscribe = window.firebase.onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (!user) {
                setIsLoading(false);
                setDataLoaded(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setIncomes([]);
            setExpenses([]);
            setUserProfile(null);
            setDataLoaded(false);
            return;
        }

        let profileData = null;
        const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
        const unsubProfile = window.firebase.onSnapshot(profileRef, (docSnap) => {
            profileData = docSnap.exists() ? docSnap.data() : { tourCompleted: false };
            
            if (!profileData.participants) {
                profileData.participants = ['Eu'];
            }

            setUserProfile(profileData);

            if (dataLoaded) {
                const isNewUser = !profileData.tourCompleted;
                 if (isNewUser) {
                    setIsTourOpen(true);
                } else if (!profileData.initialDataSeeded && incomes.length === 0 && expenses.length === 0) {
                    setShowOnboarding(true);
                }
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
    
     const handleTourClose = async () => {
        setIsTourOpen(false);
        if (user && userProfile && !userProfile.tourCompleted) {
            const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
            await window.firebase.setDoc(profileRef, { tourCompleted: true }, { merge: true });
            
            if (incomes.length === 0 && expenses.length === 0 && !userProfile.initialDataSeeded) {
                setShowOnboarding(true);
            }
        }
    };

    const handleSaveParticipants = async (newParticipants) => {
        if (user) {
            try {
                const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
                await window.firebase.setDoc(profileRef, { participants: newParticipants }, { merge: true });
                setSuccess("Participantes atualizados com sucesso!");
                
                if (!newParticipants.includes(responsible)) {
                    setResponsible(newParticipants[0] || 'Eu');
                }
            } catch (error) {
                console.error("Error saving participants:", error);
                setError("Erro ao salvar participantes.");
            }
        }
    };
    
    useEffect(() => {
        if (userProfile && dataLoaded) {
            const hasOnlySeedData = userProfile.initialDataSeeded && incomes.length > 0 && incomes.every(inc => inc.description.startsWith('Média inicial')) && expenses.length === 0;
            const hasNoData = userProfile.initialDataSeeded && incomes.length === 0 && expenses.length === 0;
            setShowRedoButton(hasOnlySeedData || hasNoData);
        } else {
            setShowRedoButton(false);
        }
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
        if (!description.trim() || amount === '' || amount === null || isNaN(parseFloat(amount))) { 
            setError("Por favor, preencha a descrição e um valor válido."); return; 
        } 
        setError(''); 
        
        const currentResponsible = participants.length > 1 ? responsible : participants[0];

        const newRecord = { 
            description, 
            amount: parseFloat(amount), 
            responsible: currentResponsible,
            month: parseInt(month), 
            year: parseInt(year), 
            createdAt: new Date() 
        }; 
        
        if(isSimulation){ 
            const simId = `sim-${Date.now()}`; 
            const recordWithSimFlag = {...newRecord, id: simId, isSimulated: true}; 
            if (formType === 'income') setSimIncomes(prev => [...prev, recordWithSimFlag]); 
            else setSimExpenses(prev => [...prev, recordWithSimFlag]); 
            setSuccess("Transação simulada adicionada."); 
        } else { 
            if (!db || !user) { setError("A conexão com o banco de dados não está pronta."); return; } 
            const collectionName = formType === 'income' ? 'incomes' : 'expenses'; 
            try { 
                const colRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`); 
                const docRef = await window.firebase.addDoc(colRef, newRecord); 
                addActionToHistory({ type: 'ADD', collection: collectionName, docId: docRef.id, data: newRecord }); 
                setSuccess(`Registro de ${formType === 'income' ? 'entrada' : 'saída'} adicionado com sucesso!`); 
            } catch (err) { 
                setError("Ocorreu um erro ao salvar o registro."); 
            } 
        } 
        setDescription(''); 
        setAmount(''); 
    };

    const handleDeleteRecord = async (id, type) => { 
        if(isSimulation){ 
            if(type === 'income') setSimIncomes(prev => prev.filter(r => r.id !== id)); 
            else setSimExpenses(prev => prev.filter(r => r.id !== id)); 
            return; 
        } 
        if (!db || !user) return; 
        const collectionName = type === 'income' ? 'incomes' : 'expenses'; 
        const recordToDelete = (type === 'income' ? incomes : expenses).find(r => r.id === id); 
        if (!recordToDelete) { setError("Registro não encontrado para apagar."); return; } 
        try { 
            const docRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`, id); 
            await window.firebase.deleteDoc(docRef); 
            addActionToHistory({ type: 'DELETE', collection: collectionName, docId: id, data: recordToDelete }); 
            setSuccess("Registro apagado com sucesso."); 
        } catch (err) { 
            setError("Ocorreu um erro ao apagar o registro."); 
        } 
    };

    const handleUpdateRecord = async (id, type, updatedData) => { 
        if(isSimulation){ 
            const updateSim = (prev) => prev.map(r => r.id === id ? updatedData : r); 
            if(type === 'income') setSimIncomes(updateSim); 
            else setSimExpenses(updateSim); 
            setEditingRecord(null); 
            return; 
        } 
        if (!db || !user) return; 
        const collectionName = type === 'income' ? 'incomes' : 'expenses'; 
        const originalRecord = (type === 'income' ? incomes : expenses).find(r => r.id === id); 
        if (!originalRecord) { setError("Registro não encontrado para atualizar."); return; } 
        try { 
            const {isSimulated, id: recordId, ...dataToSave} = updatedData; 
            const docRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`, id); 
            await window.firebase.updateDoc(docRef, dataToSave); 
            addActionToHistory({ type: 'UPDATE', collection: collectionName, docId: id, oldData: { description: originalRecord.description, amount: originalRecord.amount }, newData: dataToSave }); 
            setEditingRecord(null); 
            setSuccess("Registro atualizado com sucesso."); 
        } catch (err) { 
            setError("Ocorreu um erro ao atualizar o registro."); 
        } 
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
            setHistoryIndex(prev => prev - 1); 
            setSuccess("Ação desfeita com sucesso."); 
        } catch (err) { 
            setError("Falha ao desfazer a ação."); 
        } 
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
            setHistoryIndex(newIndex); 
            setSuccess("Ação refeita com sucesso."); 
        } catch (err) { 
            setError("Falha ao refazer a ação."); 
        } 
    };

    const handleExportData = () => { 
        if (incomes.length === 0 && expenses.length === 0) { setError("Não há dados para exportar."); return; } 
        const convertTimestamp = (data) => data.map(doc => { const { id, ...rest } = doc; if (rest.createdAt && typeof rest.createdAt.toDate === 'function') { rest.createdAt = rest.createdAt.toDate().toISOString(); } return rest; }); 
        const dataToExport = { incomes: convertTimestamp(incomes), expenses: convertTimestamp(expenses), }; 
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`; 
        const link = document.createElement("a"); link.href = jsonString; link.download = `dados_financeiros_${new Date().toISOString().slice(0, 10)}.json`; link.click(); 
        setSuccess('Dados exportados com sucesso!'); 
    };

    const handleImportClick = () => { fileInputRef.current.click(); };
    
    const handleFileChange = async (event) => { 
        const file = event.target.files[0]; 
        if (!file) return; 
        if (file.type !== "application/json") { setError("Por favor, selecione um arquivo .json válido."); return; } 
        const reader = new FileReader(); 
        reader.onload = async (e) => { 
            try { 
                const data = JSON.parse(e.target.result); 
                if (!data.incomes || !data.expenses || !Array.isArray(data.incomes) || !Array.isArray(data.expenses)) { throw new Error("Formato de arquivo inválido."); } 
                setIsLoading(true); 
                const createRecordIdentifier = (rec) => { const date = rec.createdAt?.toDate ? rec.createdAt.toDate() : new Date(rec.createdAt); return `${rec.description?.trim()}|${rec.amount}|${date.toISOString()}`; }; 
                const existingIncomes = new Set(incomes.map(createRecordIdentifier)); 
                const existingExpenses = new Set(expenses.map(createRecordIdentifier)); 
                let importedCount = 0; let skippedCount = 0; 
                const incomeCollectionRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`); 
                for (const record of data.incomes) { 
                    const newRecord = { ...record, createdAt: record.createdAt ? new Date(record.createdAt) : new Date() }; 
                    const identifier = createRecordIdentifier(newRecord); 
                    if (!existingIncomes.has(identifier)) { await window.firebase.addDoc(incomeCollectionRef, newRecord); importedCount++; } else { skippedCount++; } 
                } 
                const expenseCollectionRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`); 
                for (const record of data.expenses) { 
                    const newRecord = { ...record, createdAt: record.createdAt ? new Date(record.createdAt) : new Date() }; 
                    const identifier = createRecordIdentifier(newRecord); 
                    if (!existingExpenses.has(identifier)) { await window.firebase.addDoc(expenseCollectionRef, newRecord); importedCount++; } else { skippedCount++; } 
                } 
                setSuccess(`Importação concluída! ${importedCount} registros adicionados, ${skippedCount} duplicados ignorados.`); 
                setHistory([]); setHistoryIndex(-1); 
            } catch (err) { 
                setError(`Erro ao importar dados: ${err.message}`); 
            } finally { 
                if(fileInputRef.current) { fileInputRef.current.value = ""; } 
                setIsLoading(false); 
            } 
        }; 
        reader.readAsText(file); 
    };

    const handleRequestSort = (tab, key) => { 
        setSortConfigs(prevConfigs => { 
            const currentConfig = prevConfigs[tab]; 
            let direction = 'ascending'; 
            if (currentConfig.key === key && currentConfig.direction === 'ascending') { direction = 'descending'; } 
            return { ...prevConfigs, [tab]: { key, direction } }; 
        }); 
    };
    
    const handleSaveInitialAverage = async (avg, months) => {
         if (user) {
            const incomesColRef = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`);
            const promises = [];
            const currentDate = new Date();

            for (let i = 0; i < months; i++) {
                const pastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i + 1), 1);
                
                const seedRecord = {
                    description: `Média inicial (Mês ${i + 1}/${months})`,
                    amount: avg,
                    month: pastDate.getMonth(),
                    year: pastDate.getFullYear(),
                    createdAt: new Date()
                };
                promises.push(window.firebase.addDoc(incomesColRef, seedRecord));
            }

            try {
                await Promise.all(promises);

                const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
                await window.firebase.setDoc(profileRef, { initialDataSeeded: true, tourCompleted: true }, { merge: true });

                setShowOnboarding(false);
            } catch (err) {
                setError("Não foi possível salvar os dados iniciais. Tente novamente.");
            }
        }
    };
    
    const handleStartFromZero = async () => {
         if(user) {
            const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
            await window.firebase.setDoc(profileRef, { initialDataSeeded: true, tourCompleted: true }, { merge: true });
            setShowOnboarding(false);
         }
    };

    const handleRedoInitialAverage = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            const seedRecords = incomes.filter(inc => inc.description.startsWith('Média inicial'));
            
            const deletePromises = seedRecords.map(record => {
                const docRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/incomes`, record.id);
                return window.firebase.deleteDoc(docRef);
            });

            await Promise.all(deletePromises);

            const profileRef = window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/profile/settings`);
            await window.firebase.setDoc(profileRef, { initialDataSeeded: false }, { merge: true });
            
        } catch (err) {
            setError("Ocorreu um erro ao reiniciar a configuração.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualReserveAdjustment = async (userInputValue, adjustmentType) => {
        if (!user) return;
        
        if (userInputValue === 0) {
             if (!confirm("Tem certeza que deseja zerar? Isso apagará todos os históricos de ajustes manuais e resgates de reserva para reiniciar a contagem.")) {
                 return;
             }
             try {
                 setIsLoading(true);
                 const recordsToDelete = [];
                 incomes.forEach(doc => {
                     if (doc.isReserveAdjustment || doc.isTransferFromReserve) recordsToDelete.push({ col: 'incomes', id: doc.id });
                 });
                 expenses.forEach(doc => {
                     if (doc.isReserveAdjustment) recordsToDelete.push({ col: 'expenses', id: doc.id });
                 });
                 
                 await Promise.all(recordsToDelete.map(r => window.firebase.deleteDoc(window.firebase.doc(db, `/artifacts/${appId}/users/${user.uid}/${r.col}`, r.id))));
                 
                 setSuccess("Histórico de ajustes e resgates reiniciado. Você pode ajustar o valor novamente agora.");
                 setShowAdjustReserveModal(false);
             } catch (err) {
                 console.error(err);
                 setError("Erro ao reiniciar reserva.");
             } finally {
                 setIsLoading(false);
             }
             return;
        }

        const currentDate = new Date();
        const now = new Date();
        
        const currentMonthIncome = filteredIncomes
            .filter(i => i.month === now.getMonth() && i.year === now.getFullYear())
            .reduce((sum, i) => sum + i.amount, 0);
        
        const currentMonthExpense = filteredExpenses
            .filter(e => e.month === now.getMonth() && e.year === now.getFullYear())
            .reduce((sum, e) => sum + e.amount, 0);
        
        const currentMonthBalance = currentMonthIncome - currentMonthExpense;
        
        const suggested = calculateMovingAverage(now.getFullYear(), now.getMonth());
        
        const deficit = Math.max(0, suggested - currentMonthBalance);
        
        let incomeToAdd = 0;
        
        if (deficit > 0) {
            incomeToAdd = deficit;
        }

        try {
            if (incomeToAdd > 0) {
                const incomeRecord = {
                    description: "Resgate da Reserva (Cobrir Meta)",
                    amount: incomeToAdd,
                    month: currentDate.getMonth(),
                    year: currentDate.getFullYear(),
                    createdAt: new Date(),
                    isReserveAdjustment: false, 
                    isTransferFromReserve: true 
                };
                const incomeCol = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`);
                const docRef = await window.firebase.addDoc(incomeCol, incomeRecord);
                
                addActionToHistory({
                    type: 'ADD',
                    collection: 'incomes',
                    docId: docRef.id,
                    data: incomeRecord
                });
            }

            const adjustmentAmount = userInputValue - finalStabilityReserve - incomeToAdd;
            
            let collectionName = 'incomes';
            let finalAmount = adjustmentAmount;
            
            if (adjustmentAmount < 0) {
                collectionName = 'expenses';
                finalAmount = Math.abs(adjustmentAmount);
            }
            
            const adjustmentRecord = {
                description: `Ajuste Manual (${adjustmentType === 'correction' ? 'Correção' : 'Movimentação'})`,
                amount: finalAmount,
                month: currentDate.getMonth(),
                year: currentDate.getFullYear(),
                createdAt: new Date(),
                isReserveAdjustment: true 
            };

            const adjCol = window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/${collectionName}`);
            const docRefAdj = await window.firebase.addDoc(adjCol, adjustmentRecord);
            
            addActionToHistory({
                type: 'ADD',
                collection: collectionName,
                docId: docRefAdj.id,
                data: adjustmentRecord
            });
            
            setSuccess("Reserva ajustada com sucesso!");
            setShowAdjustReserveModal(false);
        } catch (err) {
            console.error(err);
            setError("Erro ao salvar ajuste.");
        }
    };
    
    const handleLeanCalculatorApply = (withdrawalAmount) => {
         const performLeanUpdate = async () => {
             if (!user) return;
             try {
                const currentDate = new Date();
                const incomeRecord = {
                    description: "Resgate (Vacas Magras)",
                    amount: withdrawalAmount,
                    month: currentDate.getMonth(),
                    year: currentDate.getFullYear(),
                    createdAt: new Date(),
                    isReserveAdjustment: false,
                    isTransferFromReserve: true
                };
                const incRef = await window.firebase.addDoc(window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/incomes`), incomeRecord);
                
                addActionToHistory({
                    type: 'ADD',
                    collection: 'incomes',
                    docId: incRef.id,
                    data: incomeRecord
                });

                const adjustmentAmount = -2 * withdrawalAmount;
                
                const adjRecord = {
                    description: "Saída p/ Cobertura (Vacas Magras)",
                    amount: Math.abs(adjustmentAmount),
                    month: currentDate.getMonth(),
                    year: currentDate.getFullYear(),
                    createdAt: new Date(),
                    isReserveAdjustment: true
                };
                const expRef = await window.firebase.addDoc(window.firebase.collection(db, `/artifacts/${appId}/users/${user.uid}/expenses`), adjRecord);
                
                addActionToHistory({
                    type: 'ADD',
                    collection: 'expenses',
                    docId: expRef.id,
                    data: adjRecord
                });
                
                setSuccess("Plano de Vacas Magras aplicado!");
             } catch(err) {
                 setError("Erro ao aplicar plano.");
             }
         };
         performLeanUpdate();
    };
    
    // --- Cálculos e Memoizações ---
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
        
        const relevantExpenses = combinedExpenses.filter(e => {
            const d = new Date(e.year, e.month, 1);
            return d >= windowStart && d <= targetDate && !e.isReserveAdjustment;
        });
        
        const activeMonths = new Set([...relevantIncomes, ...relevantExpenses].map(t => `${t.year}-${t.month}`));
        const numMonthsWithData = activeMonths.size > 0 ? activeMonths.size : 1;
        
        const totalIncome = relevantIncomes.reduce((sum, i) => sum + i.amount, 0);
        
        return totalIncome / numMonthsWithData;
    }, [combinedIncomes, combinedExpenses]);

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

        return {
            avgIncome: totalIncome / numMonths,
            avgExpense: totalExpense / numMonths
        };
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
         
         const grouping = {};
         const activeMonthsPerPerson = {};
         
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
             const divisor = monthsActive > 0 ? monthsActive : 1;
             return { name, avg: total / divisor, monthsCount: monthsActive };
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
        
        const history = []; 
        let runningReserve = 0; 
        
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
            
            history.push({ 
                monthKey: monthKey, 
                monthName: monthName, 
                amountAdded: amountAdded, 
                totalReserve: runningReserve, 
                movingAverageUsed: avgBalanceForThisMonth,
                hasAdjustment: adjustmentFlags[monthKey] 
            }); 
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

        const currentMonthIncomes = combinedIncomes
            .filter(i => i.month === now.getMonth() && i.year === now.getFullYear() && !i.isReserveAdjustment && !i.isTransferFromReserve)
            .reduce((sum, i) => sum + i.amount, 0);
        
        const currentMonthExpenses = combinedExpenses
            .filter(e => e.month === now.getMonth() && e.year === now.getFullYear() && !e.isReserveAdjustment)
            .reduce((sum, e) => sum + e.amount, 0);

        const currentNetBalance = currentMonthIncomes - currentMonthExpenses;

        const totalLiquidity = currentNetBalance + prevReserve;

        const suggestion = currentTwelveMonthAverage;
        
        const isLimited = totalLiquidity < suggestion;

        return {
            isLimited,
            displayValue: isLimited ? totalLiquidity : suggestion,
            originalSuggestion: suggestion,
            totalLiquidity
        };
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
        return filteredIncomes 
            .filter(i => i.month === now.getMonth() && i.year === now.getFullYear())
            .reduce((sum, i) => sum + i.amount, 0);
    }, [filteredIncomes]);

    const currentMonthBalanceForModal = useMemo(() => {
        const now = new Date();
        const income = filteredIncomes
            .filter(i => i.month === now.getMonth() && i.year === now.getFullYear())
            .reduce((sum, i) => sum + i.amount, 0);
        const transfers = reserveTransfers
            .filter(i => i.month === now.getMonth() && i.year === now.getFullYear())
            .reduce((sum, i) => sum + i.amount, 0);
        const expense = filteredExpenses
            .filter(e => e.month === now.getMonth() && e.year === now.getFullYear())
            .reduce((sum, e) => sum + e.amount, 0);
        return (income + transfers) - expense;
    }, [filteredIncomes, reserveTransfers, filteredExpenses]);

    const chartData = useMemo(() => { 
        const data = [];
        
        const reserveMap = new Map();
        const sortedHistory = [...stabilityReserveHistory].sort((a, b) => a.monthKey.localeCompare(b.monthKey));
        
        for (let i = 11; i >= 0; i--) {
            const d = new Date(contextDate.getFullYear(), contextDate.getMonth() - i, 1);
            const month = d.getMonth();
            const year = d.getFullYear();
            const monthKey = `${year}-${String(month).padStart(2, '0')}`;
            const label = d.toLocaleString('pt-BR', { month: 'short' }).replace('.','') + '/' + year.toString().slice(2);

            const income = combinedIncomes
                .filter(r => r.month === month && r.year === year && !r.isReserveAdjustment && !r.isTransferFromReserve)
                .reduce((sum, r) => sum + r.amount, 0);
            
            const transfers = combinedIncomes
                .filter(r => r.month === month && r.year === year && r.isTransferFromReserve)
                .reduce((sum, r) => sum + r.amount, 0);

            const expense = combinedExpenses
                .filter(r => r.month === month && r.year === year && !r.isReserveAdjustment)
                .reduce((sum, r) => sum + r.amount, 0);
            
            const displayBalance = income - expense; 

            const saldoSugerido = calculateMovingAverage(year, month);
            const avgIncome = calculateMovingIncomeAverage(year, month);

            let reserveVal = 0;
            const relevantHistoryEntry = sortedHistory.filter(h => h.monthKey <= monthKey).pop();
            if (relevantHistoryEntry) {
                reserveVal = relevantHistoryEntry.totalReserve;
            }

            data.push({
                monthName: label,
                balance: displayBalance,
                expense,
                saldoSugerido,
                avgIncome,
                stabilityReserve: reserveVal
            });
        }
        return data;
    }, [stabilityReserveHistory, combinedIncomes, combinedExpenses, calculateMovingAverage, calculateMovingIncomeAverage, contextDate]); 
    
    const monthlyBalanceHistory = useMemo(() => monthlySummary.filter(m => m.income > 0 || m.transfers > 0 || m.expense > 0), [monthlySummary]);
    
    const sortedMonthlyBalanceHistory = useSortableData(monthlyBalanceHistory, sortConfigs.summary);
    const sortedStabilityReserveHistory = useSortableData(stabilityReserveHistory, sortConfigs.reserve);
    const sortedFilteredIncomes = useSortableData(filteredIncomes, sortConfigs.incomes);
    const sortedFilteredExpenses = useSortableData(filteredExpenses, sortConfigs.expenses);

    const canUndo = historyIndex >= 0 && !isSimulation;
    const canRedo = historyIndex < history.length - 1 && !isSimulation;
    const tourSteps = [
        { target: '#add-record-form', title: 'Bem-vindo(a)!', content: 'Comece por aqui! Use este formulário para adicionar suas entradas e saídas. Ele estará sempre visível para acesso rápido.' },
        { target: '#summary-cards', title: 'Seu Painel Principal', content: 'Aqui você vê o mais importante: sua Reserva de Estabilidade e o Saldo Sugerido para o mês.' },
        { target: '#summary-toggle', title: 'Ver Detalhes do Ano', content: 'Quer ver o total de entradas, saídas, médias mensais e o saldo do ano? Clique aqui para expandir e ver o resumo completo.'},
        { target: '#financial-chart', title: 'Evolução Financeira', content: 'Este gráfico mostra o seu progresso mês a mês. Clique nas legendas para focar no que é mais importante.' },
        { target: '#action-buttons', title: 'Ferramentas', content: 'Precisa importar ou exportar dados? Cometeu um erro e quer desfazer? Use as ferramentas neste painel.' }
    ];

    if (isLoading && !dataLoaded) { return <div className="bg-gray-900 text-gray-300 min-h-screen flex justify-center items-center"><p>Carregando...</p></div>; }
    if (!user) { return <AuthModal auth={auth} db={db} />; }

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen font-sans">
            {showOnboarding && <OnboardingModal onSave={handleSaveInitialAverage} onCancel={handleStartFromZero} />}
            <LeanTimesCalculatorModal 
                isOpen={showLeanCalculator}
                onClose={() => setShowLeanCalculator(false)}
                currentMonthIncome={currentMonthIncomeForModal}
                currentMonthBalance={currentMonthBalanceForModal}
                currentReserve={finalStabilityReserve}
                onApply={handleLeanCalculatorApply}
            />
            <AdjustReserveModal
                isOpen={showAdjustReserveModal}
                onClose={() => setShowAdjustReserveModal(false)}
                currentCalculatedReserve={finalStabilityReserve}
                onConfirm={handleManualReserveAdjustment}
                currentMonthBalance={currentMonthBalanceForModal}
                suggestedBalance={currentTwelveMonthAverage}
            />
            <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                participants={participants}
                onSaveParticipants={handleSaveParticipants}
            />
            <Tour steps={tourSteps} isOpen={isTourOpen} onClose={handleTourClose} />
            {editingRecord && ( <EditModal record={editingRecord} onSave={handleUpdateRecord} onCancel={() => { setEditingRecord(null); setError(''); }} onError={setError} participants={participants} /> )}
            
            <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold text-gray-100 hidden sm:block">Controle Financeiro</h1>
                             <div className="border-b border-gray-700 flex flex-wrap">
                                <button onClick={() => {setView('dashboard'); setSimIncomes([]); setSimExpenses([]);}} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ view === 'dashboard' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Dashboard </button>
                                <button onClick={() => setView('simulation')} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ view === 'simulation' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Simulação </button>
                                <button onClick={() => setView('budget')} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ view === 'budget' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Orçamento </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-400 hidden md:block">
                                {user.email || user.displayName || 'Usuário Anônimo'}
                            </p>
                            <button onClick={() => setShowSettingsModal(true)} className="flex items-center justify-center p-2 bg-gray-700 text-white font-semibold rounded-full hover:bg-gray-600 transition-colors" title="Configurações">
                                <icons.SettingsIcon />
                            </button>
                            <button onClick={() => window.firebase.signOut(auth)} className="flex items-center justify-center p-2 bg-red-600/80 text-white font-semibold rounded-full hover:bg-red-500 transition-colors" title="Sair">
                                <icons.LogoutIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {isSimulation && (
                    <div className="bg-cyan-900/50 border border-cyan-700 text-cyan-300 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                        <strong>Modo Simulação:</strong> As alterações feitas aqui não serão salvas permanentemente.
                    </div>
                )}
                {error && <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}
                {success && <div className="bg-green-900/50 border border-green-500 text-green-400 px-4 py-3 rounded-lg relative mb-6" role="alert">{success}</div>}

                {isBudget && (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-8 animate-fade-in">
                        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Plano de Orçamento</h2>
                        <p className="text-gray-400">Espaço destinado à configuração do seu orçamento mensal.</p>
                    </div>
                )}

                {!isBudget && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
                        
                        {/* Coluna Principal (Esquerda) */}
<div className="lg:col-span-8 space-y-8">
    {/* SEÇÃO DE CARDS DO DASHBOARD - BLOCO A SUBSTITUIR */}
    <div id="summary-cards" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-100">Visão Geral de {filterYear}</h2>
                <p className="text-gray-400 text-sm mt-1">Seu panorama financeiro anual</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-400/50 mr-2"></div>
                        <span className="text-gray-400">Saldo</span>
                    </div>
                    <div className="flex items-center ml-3">
                        <div className="w-3 h-3 rounded-full bg-violet-500/20 border border-violet-400/50 border-dashed mr-2"></div>
                        <span className="text-gray-400">Meta</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <label htmlFor="filterYear" className="text-sm font-medium text-gray-400 mr-2">Ano:</label>
                    <div className="relative">
                        <input
                            id="filterYear"
                            type="number"
                            value={filterYear}
                            onChange={(e) => setFilterYear(parseInt(e.target.value))}
                            className="w-28 px-3 py-1.5 bg-gray-800/70 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm appearance-none"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* GRID DE CARDS PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* CARD 1: SALDO SUGERIDO */}
            <div className={`card-glass p-5 ${liquidityAnalysis.isLimited ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-cyan-500'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${liquidityAnalysis.isLimited ? 'bg-orange-500/10' : 'bg-cyan-500/10'}`}>
                                <span className={`text-lg ${liquidityAnalysis.isLimited ? 'text-orange-400' : 'text-cyan-400'}`}>
                                    {liquidityAnalysis.isLimited ? '⚠️' : '💡'}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-200 ml-3">
                                Saldo Sugerido
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                            {isSimulation && contextDate > new Date() ? 'Projeção para o mês' : 'Meta mensal baseada na sua média'}
                        </p>
                    </div>
                    {liquidityAnalysis.isLimited && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            Ajustado
                        </span>
                    )}
                </div>
                <p className={`text-3xl font-bold ${liquidityAnalysis.isLimited ? 'text-orange-400' : 'text-cyan-400'}`}>
                    {liquidityAnalysis.displayValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                {liquidityAnalysis.isLimited && (
                    <p className="text-xs text-orange-300/80 mt-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        Valor limitado pela sua liquidez atual
                    </p>
                )}
            </div>

            {/* CARD 2: RESERVA DE ESTABILIDADE */}
            <div className="card-glass p-5 border-l-4 border-l-violet-500">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-violet-500/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-200 ml-3">
                                Reserva de Estabilidade
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                            Seu colchão financeiro para imprevistos
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdjustReserveModal(true)}
                        className="p-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 transition-colors border border-gray-700"
                        title="Ajustar Reserva"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                </div>
                <p className="text-3xl font-bold text-violet-400">
                    {finalStabilityReserve.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-800/50">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-medium ${finalStabilityReserve > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {finalStabilityReserve > 0 ? '✅ Ativa' : '⏸️ Aguardando'}
                        </span>
                    </div>
                </div>
            </div>

            {/* CARD 3: SALDO DO ANO */}
            <div className={`card-glass p-5 ${balance >= 0 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                                <span className={`text-lg ${balance >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {balance >= 0 ? '📈' : '📉'}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-200 ml-3">
                                Resultado do Ano
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                            Saldo disponível em {filterYear}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${balance >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {balance >= 0 ? 'Positivo' : 'Atenção'}
                    </div>
                </div>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="text-gray-400">
                        <span className="text-emerald-400">+{totalRealIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}</span>
                        <span className="mx-1">•</span>
                        <span className="text-red-400">-{totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* BOTÃO DE EXPANDIR DETALHES */}
        <div className="text-center pt-2">
            <button
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none"
            >
                {showFullSummary ? (
                    <>
                        Ocultar detalhes do ano
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    </>
                ) : (
                    <>
                        Mostrar todas as métricas de {filterYear}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </>
                )}
            </button>
        </div>

        {/* CARDS ADICIONAIS (QUANDO EXPANDIDOS) */}
        {showFullSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 animate-fade-in">
                <div className="card-glass p-5">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Entradas (Renda)</h4>
                    <p className="text-2xl font-bold text-emerald-400">{totalRealIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-xs text-gray-500 mt-2">Total bruto recebido no ano</p>
                </div>
                <div className="card-glass p-5">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Saídas (Despesas)</h4>
                    <p className="text-2xl font-bold text-red-400">{totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-xs text-gray-500 mt-2">Total gasto no ano</p>
                </div>
                <div className="card-glass p-5">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Média Mensal</h4>
                    <p className="text-xl font-bold text-cyan-400">{last12MonthsSummary.avgIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-xs text-gray-500 mt-2">Baseada nos últimos 12 meses</p>
                </div>
            </div>
        )}
    </div>
    {/* FIM DA SEÇÃO DE CARDS DO DASHBOARD */}


                                
                                <div id="summary-toggle" className="text-center mt-6 border-t border-gray-700 pt-4">
                                    <button onClick={() => setShowFullSummary(!showFullSummary)} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-1">
                                        {showFullSummary ? 'Ocultar Detalhes do Ano' : 'Mostrar Detalhes do Ano'}
                                    </button>
                                </div>
                            </div>
                            
                            <FinancialEvolutionChart data={chartData} />

                            <div id="detailed-reports" className="bg-gray-800 p-6 rounded-xl shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-200 mb-4">Relatórios Detalhados</h2>
                                <div className="border-b border-gray-700 flex flex-wrap">
                                    <button onClick={() => setActiveTab('summary')} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ activeTab === 'summary' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Resumo Mensal </button>
                                    <button onClick={() => setActiveTab('reserve')} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ activeTab === 'reserve' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Reserva de Estabilidade </button>
                                    <button onClick={() => setActiveTab('incomes')} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ activeTab === 'incomes' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Entradas </button>
                                    <button onClick={() => setActiveTab('expenses')} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ activeTab === 'expenses' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Saídas </button>
                                    {participants.length > 1 && (
                                        <button onClick={() => setActiveTab('couple')} className={`py-2 px-4 text-sm sm:text-base font-semibold transition-colors duration-300 border-b-2 ${ activeTab === 'couple' ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300' }`} > Visão Casal </button>
                                    )}
                                </div>
                                <div className="mt-4"> 
                                    {isLoading && !user ? (<p className="text-gray-500 text-center py-4">Carregando dados...</p>) : ( <> 
                                        {activeTab === 'summary' && <MonthlyBalanceHistoryTable data={sortedMonthlyBalanceHistory} isLoading={isLoading} sortConfig={sortConfigs.summary} requestSort={(key) => handleRequestSort('summary', key)} />} 
                                        {activeTab === 'reserve' && <StabilityReserveHistoryTable data={sortedStabilityReserveHistory} sortConfig={sortConfigs.reserve} requestSort={(key) => handleRequestSort('reserve', key)} />} 
                                        {activeTab === 'incomes' && <RecordsTable title={`Detalhes de Entradas (${filterYear})`} records={sortedFilteredIncomes} onDelete={handleDeleteRecord} onEdit={(record, type) => setEditingRecord({...record, type})} type="income" sortConfig={sortConfigs.incomes} requestSort={(key) => handleRequestSort('incomes', key)} isSimulation={isSimulation} participants={participants} />} 
                                        {activeTab === 'expenses' && <RecordsTable title={`Detalhes de Saídas (${filterYear})`} records={sortedFilteredExpenses} onDelete={handleDeleteRecord} onEdit={(record, type) => setEditingRecord({...record, type})} type="expense" sortConfig={sortConfigs.expenses} requestSort={(key) => handleRequestSort('expenses', key)} isSimulation={isSimulation} />} 
                                        {activeTab === 'couple' && participants.length > 1 && <ContributionAnalysis contributionData={contributionData} individualAverages={individualAverages} />}
                                    </> )} 
                                </div>
                            </div>
                        </div>

                        {/* Coluna de Ações (Direita) */}
                        <div className="lg:col-span-4 space-y-8 lg:sticky top-24 h-screen">
                            <div id="add-record-form" className="bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-gray-200 mb-4">Adicionar Transação</h3>
                                <div className="mb-4 border-b border-gray-700 flex"> <button onClick={() => setFormType('income')} className={`py-2 px-4 text-lg font-semibold transition-colors duration-300 ${formType === 'income' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-green-400'}`}> Entrada </button> <button onClick={() => setFormType('expense')} className={`py-2 px-4 text-lg font-semibold transition-colors duration-300 ${formType === 'expense' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-red-400'}`}> Saída </button> </div>
                                <form onSubmit={handleAddRecord} className="space-y-4">
                                    <div> <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Descrição</label> <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={formType === 'income' ? 'Ex: Salário, Venda' : 'Ex: Aluguel, Compras'} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
                                    {participants.length > 1 && (
                                        <div>
                                            <label htmlFor="responsible" className="block text-sm font-medium text-gray-400 mb-1">Responsável</label>
                                            <input 
                                                id="responsible" 
                                                list="responsible-options-add"
                                                value={responsible} 
                                                onChange={(e) => setResponsible(e.target.value)} 
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Quem?"
                                            />
                                            <datalist id="responsible-options-add">
                                                {participants.map(p => <option key={p} value={p}>{p}</option>)}
                                            </datalist>
                                        </div>
                                    )}
                                    <div> <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Valor (R$)</label> <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1500.00" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div>
                                    <div className="flex gap-4"> <div className="flex-1"> <label htmlFor="month" className="block text-sm font-medium text-gray-400 mb-1">Mês</label> <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"> {Array.from({length: 12}, (_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>)} </select> </div> <div className="flex-1"> <label htmlFor="year" className="block text-sm font-medium text-gray-400 mb-1">Ano</label> <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> </div> </div>
                                    <button type="submit" className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${formType === 'income' ? 'bg-green-600 hover:bg-green-500 focus:ring-green-500' : 'bg-red-600 hover:bg-red-500 focus:ring-red-500'}`}> Adicionar {formType === 'income' ? 'Entrada' : 'Saída'} </button>
                                </form>
                            </div>
                            <div id="action-buttons" className="bg-gray-800 p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold text-gray-200 mb-4">Ferramentas</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setShowLeanCalculator(true)}
                                        className="col-span-2 flex items-center justify-center text-sm px-4 py-2 bg-yellow-700/80 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors border border-yellow-600/50">
                                        <icons.CalculatorIcon />
                                        Modo Vacas Magras
                                    </button>
                                    
                                    {showRedoButton && (
                                        <button 
                                            onClick={handleRedoInitialAverage}
                                            className="col-span-2 flex items-center justify-center text-sm px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500 transition-colors">
                                            <icons.ResetIcon />
                                            Refazer Média Inicial
                                        </button>
                                    )}
                                    <button onClick={handleImportClick} disabled={isSimulation} className="flex items-center justify-center text-sm px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"> <icons.ImportIcon /> Importar </button>
                                    <button onClick={handleExportData} disabled={isSimulation} className="flex items-center justify-center text-sm px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"> <icons.ExportIcon /> Exportar </button>
                                    <button onClick={handleUndo} disabled={!canUndo} className="flex items-center justify-center text-sm px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"> <icons.UndoIcon /> Desfazer </button>
                                    <button onClick={handleRedo} disabled={!canRedo} className="flex items-center justify-center text-sm px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"> <icons.RedoIcon /> Refazer </button>
                                    <button onClick={() => setIsTourOpen(true)} className="col-span-2 flex items-center justify-center text-sm px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition-colors"> <icons.HelpIcon /> Ajuda & Tour Guiado </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                 <footer className="text-center mt-12 py-8 text-sm text-gray-500 border-t border-gray-800">
                    <div className="flex flex-col items-center justify-center">
                        <p className="mb-2">Desenvolvido por:</p>
                        <img src="https://i.postimg.cc/dVgn73g8/Monocromatica-Horizontal.png" alt="Logo do Desenvolvedor" className="h-8 opacity-50" />
                    </div>
                </footer>
            </main>
        </div>
    );
}

// Inicializa o React
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
