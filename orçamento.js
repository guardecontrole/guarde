// orçamento.js - Versão Unificada e Estável
const { useState, useEffect, useRef } = React;

// ==========================================
// SEÇÃO 1: ÍCONES (SVG Incorporado)
// ==========================================
const IconBase = ({ children, size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const ChevronRight = (p) => <IconBase {...p}><path d="m9 18 6-6-6-6"/></IconBase>;
const Folder = (p) => <IconBase {...p}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></IconBase>;
const Plus = (p) => <IconBase {...p}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>;
const Edit = (p) => <IconBase {...p}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></IconBase>;
const Trash2 = (p) => <IconBase {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>;
const ArrowLeft = (p) => <IconBase {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconBase>;
const DollarSign = (p) => <IconBase {...p}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>;
const Percent = (p) => <IconBase {...p}><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></IconBase>;
const X = (p) => <IconBase {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>;
const AlertTriangle = (p) => <IconBase {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></IconBase>;
const BookOpen = (p) => <IconBase {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>;
const Star = (p) => <IconBase {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase>;
const Upload = (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></IconBase>;
const Download = (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></IconBase>;
const Check = (p) => <IconBase {...p}><path d="M20 6 9 17l-5-5"/></IconBase>;
const RefreshCw = (p) => <IconBase {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></IconBase>;
const Eye = (p) => <IconBase {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></IconBase>;
const Layers = (p) => <IconBase {...p}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/></IconBase>;
const ChevronDown = (p) => <IconBase {...p}><path d="m6 9 6 6 6-6"/></IconBase>;
const Lock = (p) => <IconBase {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></IconBase>;
const Unlock = (p) => <IconBase {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></IconBase>;
const MessageSquare = (p) => <IconBase {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></IconBase>;
const CheckCircle = (p) => <IconBase {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></IconBase>;
const Undo2 = (p) => <IconBase {...p}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></IconBase>;
const Redo2 = (p) => <IconBase {...p}><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></IconBase>;
const Pause = (p) => <IconBase {...p}><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></IconBase>;
const Play = (p) => <IconBase {...p}><polygon points="5 3 19 12 5 21 5 3"/></IconBase>;
const Copy = (p) => <IconBase {...p}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></IconBase>;
const MoreVertical = (p) => <IconBase {...p}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></IconBase>;

// ==========================================
// SEÇÃO 2: CONSTANTES E HELPERS
// ==========================================
const initialData = { income: 0, categories: [] };
const availableColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v);

const budgetPresets = [
    { name: 'Sugestão do App', description: 'Um modelo balanceado.', icon: Star, categories: [ { name: '🏠 Casa', percentage: 27.5, color: 'bg-blue-500', group: 'Custos de Vida' }, { name: '👶 Filhos', percentage: 21.5, color: 'bg-green-500', group: 'Custos de Vida' }, { name: '👤 Pessoal', percentage: 23.5, color: 'bg-purple-500', group: 'Custos de Vida' }, { name: '🚗 Carro', percentage: 17.5, color: 'bg-red-500', group: 'Custos de Vida' }, { name: '👵 Aposentadoria', percentage: 10.0, color: 'bg-yellow-500', group: 'Investimentos' } ] },
    { name: 'Pai Rico, Pai Pobre', description: 'Pague-se primeiro.', icon: BookOpen, categories: [ { name: '💰 Pague-se Primeiro', percentage: 30, color: 'bg-purple-500', group: 'Investimentos' }, { name: '✅ Necessidades', percentage: 60, color: 'bg-blue-500', group: 'Necessidades' }, { name: '🛍️ Desejos', percentage: 10, color: 'bg-pink-500', group: 'Desejos' } ] },
    { name: 'Thiago Nigro (50/30/20)', description: 'O clássico 50-30-20.', icon: BookOpen, categories: [ { name: '✅ Essenciais', percentage: 50, color: 'bg-blue-500', group: 'Essenciais' }, { name: '🛍️ Não Essenciais', percentage: 30, color: 'bg-pink-500', group: 'Não Essenciais' }, { name: '📈 Investimentos', percentage: 20, color: 'bg-purple-500', group: 'Investimentos' } ] },
    { name: 'Nathalia Arcuri (70/30)', description: 'Foco no futuro.', icon: BookOpen, categories: [ { name: '✅ Essenciais', percentage: 55, color: 'bg-blue-500', group: 'Presente' }, { name: '📚 Educação', percentage: 5, color: 'bg-teal-500', group: 'Presente' }, { name: '💸 Livre', percentage: 10, color: 'bg-pink-500', group: 'Presente' }, { name: '🎯 Metas', percentage: 20, color: 'bg-green-500', group: 'Futuro' }, { name: '👵 Aposentadoria', percentage: 10, color: 'bg-yellow-500', group: 'Futuro' } ] }
];

const useHistoryState = (initial) => {
    const [state, setState] = useState({ past: [], present: initial, future: [] });
    const undo = () => { if (!state.past.length) return; const newPast = state.past.slice(0, -1); setState({ past: newPast, present: state.past[state.past.length - 1], future: [state.present, ...state.future] }); };
    const redo = () => { if (!state.future.length) return; const newFuture = state.future.slice(1); setState({ past: [...state.past, state.present], present: state.future[0], future: newFuture }); };
    const set = (newVal) => { if (JSON.stringify(newVal) === JSON.stringify(state.present)) return; setState({ past: [...state.past, state.present], present: newVal, future: [] }); };
    const setInitial = (newVal) => setState({ past: [], present: newVal, future: [] });
    return { state: state.present, set, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0, setInitial };
};

// ==========================================
// SEÇÃO 3: COMPONENTES UI (Modais, Forms)
// ==========================================
const Modal = ({ children, isOpen, onClose }) => !isOpen ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 relative p-6">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
            {children}
        </div>
    </div>
);

const CategoryForm = ({ onSubmit, onCancel, categoryData, existingGroups }) => {
    const [name, setName] = useState(categoryData?.name || '');
    const [group, setGroup] = useState(categoryData?.group || '');
    const [color, setColor] = useState(categoryData?.color || availableColors[0]);
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...categoryData, name, group, color }); }} className="space-y-4">
            <h3 className="text-xl font-bold text-white">{categoryData?.id ? 'Editar' : 'Nova'} Categoria</h3>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border" placeholder="Nome" required />
            <input type="text" value={group} onChange={e => setGroup(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border" placeholder="Grupo (Opcional)" list="groups" />
            <datalist id="groups">{existingGroups.map(g => <option key={g} value={g} />)}</datalist>
            <div className="flex gap-2">{availableColors.map(c => <div key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full cursor-pointer ${c} ${color === c ? 'ring-2 ring-white' : ''}`} />)}</div>
            <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded">Cancelar</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button></div>
        </form>
    );
};

const ExpenseForm = ({ onSubmit, onCancel, expenseData }) => {
    const [desc, setDesc] = useState(expenseData?.description || '');
    const [val, setVal] = useState(expenseData?.totalValue || '');
    const [inst, setInst] = useState(expenseData?.installments || 1);
    const [status, setStatus] = useState(expenseData?.status || 'Andamento');
    const [date, setDate] = useState(expenseData?.startDate || new Date().toISOString().split('T')[0]);
    const [obs, setObs] = useState(expenseData?.observation || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const numVal = parseFloat(String(val).replace(',', '.')) || 0;
        let payload = { id: expenseData?.id || Date.now(), description: desc, status, startDate: date, observation: obs, paidInstallments: expenseData?.paidInstallments || 0, isPaused: expenseData?.isPaused || false };
        
        if (status === 'Andamento') {
            const nInst = parseInt(inst) || 1;
            payload = { ...payload, totalValue: numVal, installments: nInst, installmentValue: nInst > 0 ? numVal / nInst : numVal };
        } else if (status === 'Fixa-Variável') {
            payload = { ...payload, totalValue: numVal, installments: 9999, installmentValue: numVal, paymentHistory: expenseData?.paymentHistory || [] };
        } else { // Fixo ou Variável
            payload = { ...payload, totalValue: numVal, installments: status === 'Fixo' ? 9999 : 1, installmentValue: numVal };
        }
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white">{expenseData ? 'Editar' : 'Nova'} Despesa</h3>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border" placeholder="Descrição" required />
            <input value={val} onChange={e => setVal(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border" placeholder="Valor Total" required />
            {status === 'Andamento' && <input type="number" value={inst} onChange={e => setInst(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border" placeholder="Parcelas" min="1" />}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border" required />
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border">
                <option value="Andamento">Parcelado</option><option value="Fixo">Fixo</option><option value="Fixa-Variável">Fixo Variável</option><option value="Variável">Único</option>
            </select>
            <textarea value={obs} onChange={e => setObs(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3 border-gray-600 border" placeholder="Obs"></textarea>
            <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded">Cancelar</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button></div>
        </form>
    );
};

const PaymentModal = ({ isOpen, onClose, onSubmit, expense }) => {
    const [amt, setAmt] = useState('');
    useEffect(() => { if (isOpen && expense) setAmt(String(expense.installmentValue).replace('.', ',')); }, [isOpen, expense]);
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(parseFloat(String(amt).replace(',', '.'))); }} className="space-y-4">
                <h3 className="text-white text-xl font-bold">Registrar Pagamento</h3>
                <p className="text-gray-400">Valor pago para {expense?.description}?</p>
                <input value={amt} onChange={e => setAmt(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" autoFocus />
                <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">Cancelar</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Confirmar</button></div>
            </form>
        </Modal>
    );
};

const ExpenseList = ({ category, onBack, onUpdate, onDelete, onAdd, onPay, onUndoPay, onOpenPayModal, onPause, onDup }) => {
    const [editing, setEditing] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const total = category.expenses.filter(e => !e.isPaused).reduce((acc, e) => acc + e.installmentValue, 0);
    const avail = (category.budgetedValue || 0) - total;

    return (
        <div className="bg-gray-900 p-6 rounded-xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3"><button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-full"><ArrowLeft /></button><h2 className="text-2xl font-bold text-white">{category.name}</h2></div>
                <div className="text-right"><p className="text-gray-400 text-sm">Disponível</p><p className={`text-xl font-bold ${avail >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(avail)}</p></div>
            </div>
            <div className="flex justify-end mb-4"><button onClick={() => { setEditing(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"><Plus size={18}/> Nova Despesa</button></div>
            <div className="space-y-2">
                {category.expenses.length === 0 && <p className="text-gray-500 text-center py-4">Nenhuma despesa.</p>}
                {category.expenses.map(exp => {
                    const paid = exp.paidInstallments || 0;
                    const finished = paid >= exp.installments;
                    return (
                        <div key={exp.id} className={`flex justify-between items-center p-3 bg-gray-800 rounded border-l-4 ${exp.isPaused ? 'border-gray-600 opacity-60' : 'border-blue-500'}`}>
                            <div>
                                <p className="text-white font-medium">{exp.description} {exp.isPaused && '(Pausado)'}</p>
                                <p className="text-sm text-gray-400">{exp.status === 'Andamento' ? `${paid}/${exp.installments}` : exp.status} - {formatCurrency(exp.installmentValue)}</p>
                            </div>
                            <div className="flex gap-2">
                                {!finished && !exp.isPaused && <button onClick={() => exp.status === 'Fixa-Variável' ? onOpenPayModal(exp) : onPay(category.id, exp.id)} className="p-2 text-green-400 hover:bg-gray-700 rounded"><CheckCircle size={18}/></button>}
                                <button onClick={() => { setEditing(exp); setIsFormOpen(true); }} className="p-2 text-blue-400 hover:bg-gray-700 rounded"><Edit size={18}/></button>
                                <button onClick={() => onPause(category.id, exp.id)} className="p-2 text-yellow-400 hover:bg-gray-700 rounded">{exp.isPaused ? <Play size={18}/> : <Pause size={18}/>}</button>
                                <button onClick={() => onDelete(category.id, exp.id)} className="p-2 text-red-400 hover:bg-gray-700 rounded"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
                <ExpenseForm onSubmit={(data) => { if (editing) onUpdate(category.id, data); else onAdd(category.id, data); setIsFormOpen(false); }} onCancel={() => setIsFormOpen(false)} expenseData={editing} />
            </Modal>
        </div>
    );
};

// ==========================================
// SEÇÃO 4: LÓGICA PRINCIPAL (Página)
// ==========================================
const OrcamentoPage = () => {
    const { state: data, set: setData, undo, redo, canUndo, canRedo } = useHistoryState(initialData);
    const [selCat, setSelCat] = useState(null);
    const [catModal, setCatModal] = useState(false);
    const [editCat, setEditCat] = useState(null);
    const [payModal, setPayModal] = useState(false);
    const [payExp, setPayExp] = useState(null);
    const [presetModal, setPresetModal] = useState(false);
    
    // Calcula Grupos
    const groups = data.categories.reduce((acc, c) => {
        const g = c.group || 'Sem Grupo';
        if (!acc[g]) acc[g] = [];
        acc[g].push(c);
        return acc;
    }, {});

    const updateCategories = (newCats) => setData({ ...data, categories: newCats });
    const handleAddCat = (cData) => {
        if (cData.id) updateCategories(data.categories.map(c => c.id === cData.id ? { ...c, ...cData } : c));
        else updateCategories([...data.categories, { ...cData, id: Date.now(), budgetedValue: 0, expenses: [] }]);
        setCatModal(false);
    };
    
    const handleUpdateBudget = (id, valStr, type) => {
        const val = parseFloat(valStr.replace(',', '.'));
        const newVal = type === 'percent' ? (data.income * val) / 100 : val;
        updateCategories(data.categories.map(c => c.id === id ? { ...c, budgetedValue: newVal } : c));
    };

    // Funções de Despesa
    const modExp = (cId, fn) => {
        const newCats = data.categories.map(c => c.id === cId ? { ...c, expenses: fn(c.expenses) } : c);
        setData({ ...data, categories: newCats });
        if (selCat) setSelCat(newCats.find(c => c.id === selCat.id));
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200 pb-20 p-4 max-w-5xl mx-auto font-sans">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white">Planejamento Financeiro</h1>
                <p className="text-gray-400">Distribua sua renda e controle seus gastos.</p>
            </header>

            {selCat ? (
                <ExpenseList 
                    category={selCat} 
                    onBack={() => setSelCat(null)}
                    onAdd={(cid, e) => modExp(cid, exps => [...exps, e])}
                    onUpdate={(cid, e) => modExp(cid, exps => exps.map(x => x.id === e.id ? e : x))}
                    onDelete={(cid, eid) => modExp(cid, exps => exps.filter(x => x.id !== eid))}
                    onPay={(cid, eid) => modExp(cid, exps => exps.map(x => x.id === eid ? { ...x, paidInstallments: (x.paidInstallments || 0) + 1 } : x))}
                    onPause={(cid, eid) => modExp(cid, exps => exps.map(x => x.id === eid ? { ...x, isPaused: !x.isPaused } : x))}
                    onOpenPayModal={(e) => { setPayExp(e); setPayModal(true); }}
                />
            ) : (
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded-xl flex items-center justify-between border border-gray-700">
                        <div><p className="text-gray-400 text-sm">Renda Mensal</p><input className="text-3xl font-bold bg-transparent text-white w-40 focus:outline-none" value={data.income} onChange={e => setData({ ...data, income: parseFloat(e.target.value) || 0 })} placeholder="0" /></div>
                        <div className="text-right"><p className="text-gray-400 text-sm">Disponível</p><p className="text-2xl font-bold text-green-400">{formatCurrency(data.income - data.categories.reduce((acc, c) => acc + (c.budgetedValue || 0), 0))}</p></div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button onClick={undo} disabled={!canUndo} className="p-2 bg-gray-700 rounded disabled:opacity-50"><Undo2 /></button>
                        <button onClick={redo} disabled={!canRedo} className="p-2 bg-gray-700 rounded disabled:opacity-50"><Redo2 /></button>
                        <button onClick={() => setPresetModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"><Star size={18}/> Modelos</button>
                        <button onClick={() => { setEditCat(null); setCatModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"><Plus size={18}/> Categoria</button>
                    </div>

                    {Object.entries(groups).map(([gName, cats]) => (
                        <div key={gName} className="space-y-2">
                            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider ml-1">{gName}</h3>
                            {cats.map(c => {
                                const spent = c.expenses.filter(e => !e.isPaused).reduce((a, b) => a + b.installmentValue, 0);
                                const pct = data.income ? ((c.budgetedValue / data.income) * 100).toFixed(1) : 0;
                                return (
                                    <div key={c.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-750 transition cursor-pointer group" onClick={() => setSelCat(c)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-8 rounded ${c.color}`}></div>
                                            <div><p className="font-bold text-white">{c.name}</p><p className="text-xs text-gray-400">{formatCurrency(spent)} gastos</p></div>
                                        </div>
                                        <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                                            <div className="text-right">
                                                <input className="bg-gray-900 text-white text-right w-24 rounded p-1 border border-gray-700 text-sm" value={String(c.budgetedValue).replace('.', ',')} onChange={e => handleUpdateBudget(c.id, e.target.value, 'value')} />
                                                <p className="text-xs text-gray-500">{pct}%</p>
                                            </div>
                                            <button onClick={() => { setEditCat(c); setCatModal(true); }} className="p-2 text-gray-500 hover:text-white"><Edit size={16}/></button>
                                            <button onClick={() => updateCategories(data.categories.filter(x => x.id !== c.id))} className="p-2 text-gray-500 hover:text-red-400"><Trash2 size={16}/></button>
                                            <ChevronRight className="text-gray-600 group-hover:text-white" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={catModal} onClose={() => setCatModal(false)}>
                <CategoryForm categoryData={editCat} onSubmit={handleAddCat} onCancel={() => setCatModal(false)} existingGroups={Object.keys(groups).filter(g => g !== 'Sem Grupo')} />
            </Modal>
            
            <PaymentModal isOpen={payModal} onClose={() => setPayModal(false)} expense={payExp} onSubmit={(val) => { modExp(selCat.id, exps => exps.map(x => x.id === payExp.id ? { ...x, paidInstallments: (x.paidInstallments || 0) + 1, installmentValue: val } : x)); setPayModal(false); }} />

            {presetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4">
                    <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4"><h3 className="text-2xl font-bold text-white">Escolha um Modelo</h3><button onClick={() => setPresetModal(false)} className="text-white"><X /></button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {budgetPresets.map(p => (
                                <div key={p.name} onClick={() => { updateCategories(p.categories.map(c => ({ ...c, id: Date.now() + Math.random(), budgetedValue: (data.income * c.percentage) / 100, expenses: [] }))); setPresetModal(false); }} className="bg-gray-700 p-4 rounded hover:bg-gray-600 cursor-pointer border border-gray-600">
                                    <h4 className="font-bold text-white flex items-center gap-2"><p.icon size={18}/> {p.name}</h4>
                                    <p className="text-sm text-gray-400 mb-2">{p.description}</p>
                                    <div className="flex gap-1 flex-wrap">{p.categories.map(c => <span key={c.name} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{c.name} {c.percentage}%</span>)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

window.OrcamentoPage = OrcamentoPage;
