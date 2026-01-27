// Adaptação para rodar no navegador sem build system
const { useState, useEffect, useRef, useMemo } = React;

// ==========================================
// 1. ÍCONES (SVG NATIVO)
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
// 2. CONFIGURAÇÕES E DADOS
// ==========================================
const initialData = { income: 0, categories: [] };
const availableColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];

const budgetPresets = [
    { name: 'Sugestão do App', description: 'Um modelo balanceado.', icon: Star, categories: [ { name: '🏠 Casa', percentage: 27.5, color: 'bg-blue-500', group: 'Custos de Vida' }, { name: '👶 Filhos', percentage: 21.5, color: 'bg-green-500', group: 'Custos de Vida' }, { name: '👤 Pessoal', percentage: 23.5, color: 'bg-purple-500', group: 'Custos de Vida' }, { name: '🚗 Carro', percentage: 17.5, color: 'bg-red-500', group: 'Custos de Vida' }, { name: '👵 Aposentadoria', percentage: 10.0, color: 'bg-yellow-500', group: 'Investimentos' } ] },
    { name: 'Pai Rico, Pai Pobre', description: 'Inspirado em Robert Kiyosaki.', icon: BookOpen, categories: [ { name: '💰 Pague-se Primeiro', percentage: 30, color: 'bg-purple-500', group: 'Investimentos' }, { name: '✅ Necessidades', percentage: 60, color: 'bg-blue-500', group: 'Necessidades' }, { name: '🛍️ Desejos', percentage: 10, color: 'bg-pink-500', group: 'Desejos' } ] },
    { name: 'Thiago Nigro (50/30/20)', description: 'O clássico 50-30-20.', icon: BookOpen, categories: [ { name: '✅ Essenciais', percentage: 50, color: 'bg-blue-500', group: 'Essenciais' }, { name: '🛍️ Não Essenciais', percentage: 30, color: 'bg-pink-500', group: 'Não Essenciais' }, { name: '📈 Investimentos', percentage: 20, color: 'bg-purple-500', group: 'Investimentos' } ] },
    { name: 'Nathalia Arcuri (70/30)', description: 'Foco no futuro.', icon: BookOpen, categories: [ { name: '✅ Essenciais', percentage: 55, color: 'bg-blue-500', group: 'Presente' }, { name: '📚 Educação', percentage: 5, color: 'bg-teal-500', group: 'Presente' }, { name: '💸 Livre', percentage: 10, color: 'bg-pink-500', group: 'Presente' }, { name: '🎯 Metas', percentage: 20, color: 'bg-green-500', group: 'Futuro' }, { name: '👵 Aposentadoria', percentage: 10, color: 'bg-yellow-500', group: 'Futuro' } ] },
    { name: 'Bruno Perini', description: 'Foco em aportes.', icon: BookOpen, categories: [ { name: '✅ Essenciais', percentage: 60, color: 'bg-blue-500', group: 'Despesas' }, { name: '🛍️ Livres', percentage: 20, color: 'bg-pink-500', group: 'Despesas' }, { name: '🛡️ Fundo', percentage: 10, color: 'bg-yellow-500', group: 'Investimentos' }, { name: '📈 Aportes', percentage: 10, color: 'bg-purple-500', group: 'Investimentos' } ] },
    { name: 'Warren Buffett', description: 'Simplicidade 90/10.', icon: BookOpen, categories: [ { name: '✅ Essenciais', percentage: 50, color: 'bg-blue-500', group: 'Despesas' }, { name: '🛍️ Livres', percentage: 20, color: 'bg-pink-500', group: 'Despesas' }, { name: '🛡️ Reserva', percentage: 10, color: 'bg-yellow-500', group: 'Investimentos' }, { name: '📈 S&P 500', percentage: 18, color: 'bg-purple-500', group: 'Investimentos' }, { name: '🏦 Renda Fixa', percentage: 2, color: 'bg-teal-500', group: 'Investimentos' } ] }
];

const useHistoryState = (initial) => {
    const [state, setState] = useState({ past: [], present: initial, future: [] });
    const undo = () => { if (!state.past.length) return; const newPast = state.past.slice(0, -1); setState({ past: newPast, present: state.past[state.past.length - 1], future: [state.present, ...state.future] }); };
    const redo = () => { if (!state.future.length) return; const newFuture = state.future.slice(1); setState({ past: [...state.past, state.present], present: state.future[0], future: newFuture }); };
    const set = (newVal) => { if (JSON.stringify(newVal) === JSON.stringify(state.present)) return; setState({ past: [...state.past, state.present], present: newVal, future: [] }); };
    const setInitial = (newVal) => setState({ past: [], present: newVal, future: [] });
    return { state: state.present, set, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0, setInitial };
};

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v);

// ==========================================
// 3. COMPONENTES UI
// ==========================================
const Modal = ({ children, isOpen, onClose }) => !isOpen ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 relative p-6">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
            {children}
        </div>
    </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => !isOpen ? null : (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-white flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-yellow-500/20 rounded-full mb-4"><AlertTriangle size={40} className="text-yellow-500" /></div>
            <h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-gray-300 mb-6">{message}</p>
            <div className="flex justify-center space-x-4 w-full"><button onClick={onClose} className="flex-1 px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500">Cancelar</button><button onClick={onConfirm} className="flex-1 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold">Confirmar</button></div>
        </div>
    </Modal>
);

const PaymentAmountModal = ({ isOpen, onClose, onSubmit, expense }) => {
    const [amount, setAmount] = useState('');
    useEffect(() => { if (isOpen && expense) setAmount(String(expense.installmentValue || '').replace('.', ',')); }, [isOpen, expense]);
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={(e) => { e.preventDefault(); const val = parseFloat(String(amount).replace(',', '.')); if (!isNaN(val) && val >= 0) onSubmit(val); }} className="space-y-4 text-white">
                <h3 className="text-xl font-bold">Registrar Pagamento</h3><p>Valor pago para <span className="font-bold">{expense?.description}</span>?</p>
                <input type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3" required autoFocus />
                <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded-lg">Cancelar</button><button type="submit" className="px-6 py-2 bg-blue-600 rounded-lg">Confirmar</button></div>
            </form>
        </Modal>
    );
};

const PresetModal = ({ isOpen, onClose, onSelectPreset }) => !isOpen ? null : (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
        <div className="text-white"><h3 className="text-2xl font-bold mb-2 text-center">Modelos de Orçamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {budgetPresets.map(p => (
                    <div key={p.name} onClick={() => onSelectPreset(p)} className="bg-gray-700/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 cursor-pointer">
                        <div className="flex items-center mb-3"><p.icon className="text-blue-400 mr-3" size={24} /><h4 className="text-lg font-bold">{p.name}</h4></div>
                        <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                        <div className="flex flex-wrap gap-2">{p.categories.map(c => <span key={c.name} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{c.name} {c.percentage}%</span>)}</div>
                    </div>
                ))}
            </div>
        </div>
    </Modal>
);

const EditGroupModal = ({ isOpen, onClose, onSubmit, groupName }) => {
    const [name, setName] = useState('');
    useEffect(() => { if (isOpen) setName(groupName); }, [isOpen, groupName]);
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={e => { e.preventDefault(); if (name.trim() && name !== groupName) onSubmit(groupName, name.trim()); onClose(); }} className="space-y-6 text-white">
                <h3 className="text-xl font-bold">Editar Grupo</h3>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3" required autoFocus />
                <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded-lg">Cancelar</button><button type="submit" className="px-6 py-2 bg-blue-600 rounded-lg">Salvar</button></div>
            </form>
        </Modal>
    );
};

const CategoryForm = ({ onSubmit, onCancel, categoryData, existingGroups = [] }) => {
    const [name, setName] = useState(categoryData?.name || '');
    const [group, setGroup] = useState(categoryData?.group || '');
    const [color, setColor] = useState(categoryData?.color || availableColors[0]);
    return (
        <form onSubmit={e => { e.preventDefault(); onSubmit({ ...categoryData, name, group, color }); }} className="space-y-6">
            <h3 className="text-xl font-bold text-white">{categoryData?.id ? 'Editar' : 'Nova'} Categoria</h3>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" placeholder="Nome" required />
            <input value={group} onChange={e => setGroup(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" placeholder="Grupo (Opcional)" list="gs" />
            <datalist id="gs">{(existingGroups || []).map(g => <option key={g} value={g} />)}</datalist>
            <div className="flex gap-3">{availableColors.map(c => <div key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full cursor-pointer ${c} ${color === c ? 'ring-2 ring-white' : ''}`} />)}</div>
            <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 rounded text-white">Cancelar</button><button type="submit" className="px-6 py-2 bg-blue-600 rounded text-white">Salvar</button></div>
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
            const n = parseInt(inst) || 1;
            payload = { ...payload, totalValue: numVal, installments: n, installmentValue: n > 0 ? numVal / n : numVal };
        } else if (status === 'Fixa-Variável') {
            payload = { ...payload, totalValue: numVal, installments: 9999, installmentValue: numVal, paymentHistory: expenseData?.paymentHistory || [] };
        } else {
            payload = { ...payload, totalValue: numVal, installments: status === 'Fixo' ? 9999 : 1, installmentValue: numVal };
        }
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white">{expenseData ? 'Editar' : 'Nova'} Despesa</h3>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" placeholder="Descrição" required />
            <input value={val} onChange={e => setVal(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" placeholder="Valor" required />
            {status === 'Andamento' && <input type="number" value={inst} onChange={e => setInst(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" placeholder="Parcelas" min="1" />}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" required />
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3"><option value="Andamento">Parcelado</option><option value="Fixo">Fixo</option><option value="Fixa-Variável">Fixo Variável</option><option value="Variável">Único</option></select>
            <textarea value={obs} onChange={e => setObs(e.target.value)} className="w-full bg-gray-700 text-white rounded p-3" placeholder="Obs" />
            <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-600 rounded text-white">Cancelar</button><button type="submit" className="px-6 py-2 bg-blue-600 rounded text-white">Salvar</button></div>
        </form>
    );
};

const ExpenseList = ({ category, onBack, onUpdateExpense, onDeleteExpense, onAddExpense, onMarkAsPaid, onUndoPayment, onOpenPaymentModal, onTogglePause, onDuplicateExpense }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [actionExp, setActionExp] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    
    if (!category) return null;
    const expenses = category.expenses || [];
    const total = expenses.filter(e => !e.isPaused).reduce((acc, e) => acc + e.installmentValue, 0);
    const avail = (category.budgetedValue || 0) - total;

    return (
        <div className="bg-gray-900 text-gray-200 p-6 rounded-2xl animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4"><button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-full"><ArrowLeft /></button><h2 className="text-2xl font-bold">{category.name}</h2></div>
                <div className="flex gap-6 text-right">
                     <div><p className="text-sm text-gray-400">Orçado</p><p className="text-xl font-bold text-white">{formatCurrency(category.budgetedValue || 0)}</p></div>
                     <div><p className="text-sm text-gray-400">Gasto</p><p className="text-xl font-bold text-red-400">{formatCurrency(total)}</p></div>
                     <div><p className="text-sm text-gray-400">Disponível</p><p className={`text-xl font-bold ${avail >= 0 ? 'text-green-400' : 'text-yellow-400'}`}>{formatCurrency(avail)}</p></div>
                </div>
            </div>
            <div className="flex justify-end mb-6">
                <button onClick={() => { setEditing(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 font-semibold"><Plus size={20}/> Adicionar Despesa</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto border-collapse">
                    <thead className="border-b border-gray-700">
                        <tr className="text-sm text-gray-400"><th className="p-4">Descrição</th><th className="p-4 text-right">Valor</th><th className="p-4 text-center">Progresso</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Ações</th></tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (<tr><td colSpan="5" className="text-center py-10 text-gray-500">Nenhuma despesa adicionada.</td></tr>) : expenses.map(exp => {
                            const isPaused = exp.isPaused; const paid = exp.paidInstallments || 0; const done = paid >= exp.installments;
                            let dueDate = null, isOverdue = false;
                            if (exp.startDate) { const start = new Date(exp.startDate); dueDate = new Date(start.getFullYear(), start.getMonth() + paid, start.getDate() + 1); const today = new Date(); today.setHours(0,0,0,0); if (today > dueDate && !done && !isPaused) isOverdue = true; }
                            const remaining = (exp.installments - paid) * exp.installmentValue;
                            const statusLabel = isPaused ? 'Pausado' : done ? 'Pago' : isOverdue ? 'Atrasado' : exp.status;
                            const statusColor = isPaused ? 'bg-gray-700 text-gray-400' : done ? 'bg-green-500/20 text-green-400' : isOverdue ? 'bg-red-500/20 text-red-400' : exp.status === 'Fixa-Variável' ? 'bg-indigo-500/20 text-indigo-400' : exp.status === 'Fixo' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400';
                            return (
                                <tr key={exp.id} className={`border-b border-gray-800 hover:bg-gray-800/50 transition ${isPaused ? 'opacity-60' : ''}`}>
                                    <td className="p-4 font-bold text-white"><div className="flex items-center gap-2">{exp.description}{exp.observation && <div className="relative group"><MessageSquare size={16} className="text-gray-500 cursor-pointer"/><div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-900 border border-gray-700 rounded text-xs hidden group-hover:block z-10">{exp.observation}</div></div>}</div></td>
                                    <td className="p-4 text-right font-bold text-blue-400">{formatCurrency(exp.installmentValue)}</td>
                                    <td className="p-4 text-center text-gray-300">{exp.status === 'Fixo' || exp.status === 'Fixa-Variável' ? (<div className="flex flex-col items-center"><span className="text-xs text-gray-400">Próx. Venc:</span><span className="text-sm font-medium">{dueDate ? dueDate.toLocaleDateString('pt-BR') : 'N/A'}</span></div>) : exp.status === 'Variável' ? 'Pag. Única' : (<div className="flex flex-col items-center"><span className="font-bold">{paid} / {exp.installments}</span><span className="text-xs text-gray-500">Falta: {formatCurrency(remaining)}</span></div>)}</td>
                                    <td className="p-4 text-center"><span className={`px-3 py-1 rounded-md text-xs font-bold ${statusColor}`}>{statusLabel}</span></td>
                                    <td className="p-4 text-center flex justify-center gap-2">{!done && !isPaused && <button onClick={() => exp.status === 'Fixa-Variável' ? onOpenPaymentModal(exp) : onMarkAsPaid(category.id, exp.id)} className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg"><CheckCircle size={20}/></button>}<button onClick={() => setActionExp(exp)} className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg"><MoreVertical size={20}/></button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}><ExpenseForm onSubmit={d => { if (editing) onUpdateExpense(category.id, d); else onAddExpense(category.id, d); setIsFormOpen(false); }} onCancel={() => setIsFormOpen(false)} expenseData={editing} /></Modal>
            <Modal isOpen={!!actionExp} onClose={() => setActionExp(null)}>
                {actionExp && <div className="text-white space-y-2"><h3 className="text-center font-bold mb-4">{actionExp.description}</h3><button onClick={() => { setEditing(actionExp); setIsFormOpen(true); setActionExp(null); }} className="w-full text-left p-3 hover:bg-gray-700 rounded flex gap-2"><Edit size={18}/> Editar</button><button onClick={() => { onDuplicateExpense(category.id, actionExp.id); setActionExp(null); }} className="w-full text-left p-3 hover:bg-gray-700 rounded flex gap-2"><Copy size={18}/> Duplicar</button><button onClick={() => { onTogglePause(category.id, actionExp.id); setActionExp(null); }} className="w-full text-left p-3 hover:bg-gray-700 rounded flex gap-2">{actionExp.isPaused ? <Play size={18}/> : <Pause size={18}/>} {actionExp.isPaused ? 'Reativar' : 'Pausar'}</button>{actionExp.paidInstallments > 0 && <button onClick={() => { onUndoPayment(category.id, actionExp.id); setActionExp(null); }} className="w-full text-left p-3 hover:bg-gray-700 text-yellow-400 rounded flex gap-2"><Undo2 size={18}/> Desfazer Pagamento</button>}<button onClick={() => { setConfirmDelete(actionExp.id); setActionExp(null); }} className="w-full text-left p-3 hover:bg-gray-700 text-red-400 rounded flex gap-2"><Trash2 size={18}/> Excluir</button></div>}
            </Modal>
            <ConfirmationModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { onDeleteExpense(category.id, confirmDelete); setConfirmDelete(null); }} title="Excluir Despesa" message="Tem certeza?" />
        </div>
    );
};

const CategoryItem = ({ category, income, onUpdateBudget, onSelectCategory, onEdit, onDelete, isPreviewing, onToggleLock, dragProps }) => {
    const [val, setVal] = useState('0,00');
    const [pct, setPct] = useState('0,0');
    const [mode, setMode] = useState('value');

    useEffect(() => {
        const v = category.budgetedValue || 0;
        setVal(v.toFixed(2).replace('.', ','));
        setPct(income > 0 ? ((v / income) * 100).toFixed(1).replace('.', ',') : '0,0');
    }, [category.budgetedValue, income]);

    const handleBlur = (type) => {
        if (category.isLocked) return;
        onUpdateBudget(category.id, type === 'value' ? val : pct, type);
    };

    const expenses = category.expenses || [];
    const spent = expenses.filter(e => !e.isPaused).reduce((a, b) => a + b.installmentValue, 0);
    const rest = (category.budgetedValue || 0) - spent;
    const bar = (category.budgetedValue || 0) > 0 ? Math.min((spent / category.budgetedValue) * 100, 100) : 0;
    
    const isDragged = dragProps.draggedItem?.id === category.id;
    const isTarget = dragProps.dragOverItem?.id === category.id;

    return (
        <div draggable={!isPreviewing} onDragStart={() => dragProps.onDragStart({ id: category.id, type: 'category', group: category.group })} onDragEnd={dragProps.onDragEnd} onDrop={e => { e.preventDefault(); dragProps.onDrop({ id: category.id, type: 'category', group: category.group }); }} onDragOver={e => { e.preventDefault(); dragProps.onDragEnter({ id: category.id, type: 'category' }); }} className={`bg-gray-700/50 p-4 rounded-xl relative group ${isDragged ? 'opacity-50' : ''} ${category.isLocked ? 'border-2 border-red-500/50' : 'border-2 border-transparent'}`}>
            {isTarget && !isDragged && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full"/>}
            <div className="flex justify-between items-center mb-2">
                <div onClick={() => !isPreviewing && onSelectCategory(category)} className="flex items-center gap-3 cursor-pointer flex-grow"><div className={`w-3 h-6 rounded ${category.color}`}/><Folder size={20} className="text-gray-400"/><span className="font-semibold text-white">{category.name}</span></div>
                <div className="flex gap-1"><button onClick={() => !isPreviewing && onToggleLock(category.id)} className={`p-2 rounded hover:bg-gray-600 ${category.isLocked ? 'text-red-400' : 'text-gray-400'}`}>{category.isLocked ? <Lock size={16}/> : <Unlock size={16}/>}</button><button onClick={() => !isPreviewing && onEdit(category)} disabled={isPreviewing || category.isLocked} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded disabled:opacity-50"><Edit size={18} /></button><button onClick={() => !isPreviewing && onDelete(category.id)} disabled={isPreviewing} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded disabled:opacity-50"><Trash2 size={18} /></button></div>
            </div>
            <div className="flex gap-2 items-center text-sm mb-2">
                {mode === 'value' ? <div className="relative flex-grow"><span className="absolute left-2 top-2 text-gray-400">R$</span><input className="w-full bg-gray-800 text-white rounded p-2 pl-8" value={val} onChange={e => setVal(e.target.value)} onBlur={() => handleBlur('value')} disabled={category.isLocked}/></div> : <div className="relative flex-grow"><input className="w-full bg-gray-800 text-white rounded p-2 pr-8" value={pct} onChange={e => setPct(e.target.value)} onBlur={() => handleBlur('percent')} disabled={category.isLocked}/><span className="absolute right-2 top-2 text-gray-400">%</span></div>}
                <button onClick={() => setMode(m => m === 'value' ? 'percent' : 'value')} disabled={isPreviewing || category.isLocked} className="p-2 text-gray-400 bg-gray-700 rounded-lg hover:text-blue-400 transition disabled:opacity-50"><RefreshCw size={16} /></button>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Gasto: {formatCurrency(spent)}</span><span className={rest < 0 ? 'text-red-400' : 'text-green-400'}>{rest < 0 ? 'Estourado' : 'Sobra'}: {formatCurrency(Math.abs(rest))}</span></div>
            <div className="w-full bg-gray-600 h-2 rounded-full"><div className={`h-2 rounded-full ${rest < 0 ? 'bg-red-500' : category.color}`} style={{ width: `${bar}%` }}/></div>
        </div>
    );
};

const PresetConfirmationBar = ({ onConfirm, onCancel }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 p-4 flex justify-between items-center max-w-5xl mx-auto backdrop-blur-md z-50">
        <p className="text-white font-bold">Usar este modelo?</p>
        <div className="flex gap-4"><button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded">Cancelar</button><button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded">Confirmar</button></div>
    </div>
);

const BudgetAdjustmentBar = ({ totalPercentage, onAdjust }) => {
    const diff = Math.abs(100 - totalPercentage).toFixed(1);
    const isOver = totalPercentage > 100;
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-yellow-500 p-4 z-40"><div className="container mx-auto flex justify-between items-center max-w-5xl text-yellow-400 font-bold"><span>{isOver ? `Passou ${diff}%` : `Falta ${diff}%`}</span><button onClick={onAdjust} className="px-4 py-2 bg-blue-600 text-white rounded">Ajustar</button></div></div>
    );
};

const CategoryList = ({ categories, income, onSelectCategory, onUpdateIncome, onUpdateCategoryBudget, onOpenCategoryModal, onDeleteCategoryRequest, onDeleteGroupRequest, onOpenPresetModal, onExport, onImport, tempPresetCategories, onConfirmPreset, onCancelPreset, onToggleLock, onMoveItem, onOpenEditGroupModal, undo, redo, canUndo, canRedo }) => {
    const cats = tempPresetCategories || categories || [];
    const totalExp = cats.reduce((acc, c) => {
        const catExpenses = c.expenses || [];
        const catTotal = catExpenses.filter(e => !e.isPaused).reduce((a, b) => a + b.installmentValue, 0);
        return acc + catTotal;
    }, 0);

    const balance = income - totalExp;
    const hasIncome = income > 0;
    
    const [incVal, setIncVal] = useState(String(income));
    const [editInc, setEditInc] = useState(false);
    const [collapsed, setCollapsed] = useState({});
    const [dragItem, setDragItem] = useState(null);
    const [dragOver, setDragOver] = useState(null);

    useEffect(() => setIncVal(String(income).replace('.', ',')), [income]);
    
    const dragProps = {
        draggedItem: dragItem, dragOverItem: dragOver,
        onDragStart: setDragItem, onDragEnd: () => { setDragItem(null); setDragOver(null); },
        onDragEnter: (item) => { if (dragItem?.id !== item.id) setDragOver(item); },
        onDragLeave: () => setDragOver(null),
        onDrop: (target) => { if (dragItem) onMoveItem(dragItem, target); setDragItem(null); setDragOver(null); }
    };

    const grouped = cats.filter(c => c.group && typeof c.group === 'string' && c.group.trim() !== '').reduce((acc, c) => { (acc[c.group] = acc[c.group] || []).push(c); return acc; }, {});
    const orphans = cats.filter(c => !c.group || typeof c.group !== 'string' || c.group.trim() === '');

    return (
        <div className="space-y-6 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-3 border border-gray-700">
                    <div className="p-3 bg-green-500/20 rounded"><DollarSign className="text-green-400"/></div>
                    <div><p className="text-gray-400 text-xs">Saldo Sugerido</p>{editInc ? <input autoFocus className="bg-transparent text-xl font-bold text-white w-full outline-none" value={incVal} onChange={e => setIncVal(e.target.value)} onBlur={() => { onUpdateIncome(parseFloat(incVal.replace(',', '.')) || 0); setEditInc(false); }} /> : <p onClick={() => !tempPresetCategories && setEditInc(true)} className="text-xl font-bold cursor-pointer hover:text-blue-400">{formatCurrency(income)}</p>}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-3"><div className="p-3 bg-red-500/20 rounded"><DollarSign className="text-red-400"/></div><div><p className="text-gray-400 text-xs">Despesas</p><p className="text-xl font-bold">{formatCurrency(totalExp)}</p></div></div>
                <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-3"><div className={`p-3 rounded ${balance >= 0 ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}><DollarSign className={balance >= 0 ? 'text-blue-400' : 'text-yellow-400'}/></div><div><p className="text-gray-400 text-xs">Saldo</p><p className={`text-xl font-bold ${balance >= 0 ? 'text-white' : 'text-yellow-400'}`}>{formatCurrency(balance)}</p></div></div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap gap-2 justify-end mb-4">
                    <button onClick={undo} disabled={!canUndo} className="p-2 bg-gray-700 rounded disabled:opacity-50"><Undo2 size={20}/></button>
                    <button onClick={redo} disabled={!canRedo} className="p-2 bg-gray-700 rounded disabled:opacity-50"><Redo2 size={20}/></button>
                    <button onClick={onImport} disabled={!!tempPresetCategories} className="p-2 bg-gray-700 rounded hover:bg-gray-600"><Upload size={20}/></button>
                    <button onClick={onExport} disabled={!!tempPresetCategories} className="p-2 bg-gray-700 rounded hover:bg-gray-600"><Download size={20}/></button>
                    <button onClick={onOpenCategoryModal} disabled={!hasIncome || !!tempPresetCategories} className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"><Plus size={18}/> Categoria</button>
                </div>

                {cats.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-xl">
                        <p className="text-gray-400 mb-4">Seu orçamento está vazio.</p>
                        <button onClick={onOpenPresetModal} disabled={!hasIncome} className="px-4 py-2 bg-purple-600 rounded text-white hover:bg-purple-500 disabled:opacity-50">Usar Modelo</button>
                    </div>
                )}

                {Object.entries(grouped).map(([grp, grpCats]) => (
                    <div key={grp} className="mb-4">
                        <div className="flex justify-between items-center bg-gray-700/30 p-2 rounded mb-2 cursor-pointer" onClick={() => setCollapsed(p => ({...p, [grp]: !p[grp]}))}>
                            <div className="flex items-center gap-2"><Layers size={16} className="text-gray-400"/><span className="font-bold uppercase text-sm tracking-wider">{grp}</span><ChevronDown size={16} className={`transform transition ${collapsed[grp] ? '-rotate-90' : ''}`}/></div>
                            <div className="flex gap-2"><button onClick={e => { e.stopPropagation(); onOpenEditGroupModal(grp); }} className="p-1 hover:text-blue-400"><Edit size={16}/></button><button onClick={e => { e.stopPropagation(); onDeleteGroupRequest(grp); }} className="p-1 hover:text-red-400"><Trash2 size={16}/></button></div>
                        </div>
                        {!collapsed[grp] && <div className="pl-4 space-y-2 border-l border-gray-700 ml-2">{grpCats.map(c => <CategoryItem key={c.id} category={c} income={income} onUpdateBudget={onUpdateCategoryBudget} onSelectCategory={onSelectCategory} onEdit={onOpenCategoryModal} onDelete={onDeleteCategoryRequest} isPreviewing={!!tempPresetCategories} onToggleLock={onToggleLock} dragProps={dragProps} />)}</div>}
                    </div>
                ))}
                
                <div className="space-y-2 mt-4">
                    {orphans.map(c => <CategoryItem key={c.id} category={c} income={income} onUpdateBudget={onUpdateCategoryBudget} onSelectCategory={onSelectCategory} onEdit={onOpenCategoryModal} onDelete={onDeleteCategoryRequest} isPreviewing={!!tempPresetCategories} onToggleLock={onToggleLock} dragProps={dragProps} />)}
                </div>
            </div>
            {!!tempPresetCategories && <PresetConfirmationBar onConfirm={onConfirmPreset} onCancel={onCancelPreset} />}
        </div>
    );
};

// Componente Principal - AQUI ESTÁ A CORREÇÃO DEFINITIVA
const OrcamentoPage = ({ initialIncome = 0 }) => {
    // 1. DADOS INICIAIS
    const { state: data, set: setData, undo, redo, canUndo, canRedo, setInitial: setInitialData } = useHistoryState(initialData);
    
    // 2. CORREÇÃO DO ERRO 'REFERENCE ERROR': DEFINIÇÃO SEGURA DOS GRUPOS EXISTENTES NO TOPO
    const existingGroups = useMemo(() => {
        const cats = data?.categories || [];
        return [...new Set(cats.map(c => c.group).filter(g => g && g.trim()))];
    }, [data]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleteGroupConfirmOpen, setDeleteGroupConfirmOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
    const [isImportConfirmOpen, setImportConfirmOpen] = useState(false);
    const [fileToImport, setFileToImport] = useState(null);
    const fileInputRef = useRef(null);
    const [tempPresetCategories, setTempPresetCategories] = useState(null);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [expenseToPay, setExpenseToPay] = useState(null);
    const [isEditGroupModalOpen, setEditGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    
    // --- PERSISTÊNCIA REAL-TIME NO FIREBASE ---
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { db, auth, appId } = window.firebaseApp || {};

    // 1. Carregar dados em tempo real (onSnapshot)
    useEffect(() => {
        if (!auth || !auth.currentUser || !db) {
            setIsLoadingData(false);
            return;
        }

        const docRef = window.firebase.doc(db, `artifacts/${appId}/users/${auth.currentUser.uid}/data/budget`);
        const unsubscribe = window.firebase.onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const loadedData = docSnap.data();
                // BLINDAGEM: Garante que arrays não sejam nulos
                if (!loadedData.categories) loadedData.categories = [];
                loadedData.categories = loadedData.categories.map(c => ({
                    ...c,
                    expenses: Array.isArray(c.expenses) ? c.expenses : []
                }));
                setInitialData(loadedData);
            }
            setIsLoadingData(false);
        }, (error) => {
            console.error("Erro ao carregar orçamento:", error);
            setIsLoadingData(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Salvar dados no Firebase (apenas se já carregou)
    useEffect(() => {
        if (isLoadingData) return; // PROIBIDO SALVAR ENQUANTO CARREGA
        if (!auth || !auth.currentUser || !db) return;

        const saveBudget = async () => {
            try {
                const docRef = window.firebase.doc(db, `artifacts/${appId}/users/${auth.currentUser.uid}/data/budget`);
                await window.firebase.setDoc(docRef, data);
            } catch (e) {
                console.error("Erro ao salvar orçamento:", e);
            }
        };

        const timeoutId = setTimeout(saveBudget, 1000); // Salva após 1s de inatividade
        return () => clearTimeout(timeoutId);
    }, [data, isLoadingData]);


    // --- AUTOMAÇÃO DA RECEITA ---
    useEffect(() => {
        if (!isLoadingData && initialIncome > 0 && Math.abs(initialIncome - data.income) > 0.01) {
            handleUpdateIncome(initialIncome);
        }
    }, [initialIncome, isLoadingData]);

    const handleUpdateIncome = (val) => {
        if (data.income === val) return;
        const currentCats = data.categories || [];
        const newCats = currentCats.map(c => { 
            if (c.isLocked || data.income <= 0) return c; 
            const prevPct = (c.budgetedValue || 0) / (data.income || 1);
            return { ...c, budgetedValue: val * prevPct }; 
        });
        setData({ income: val, categories: newCats });
    };

    const handleCategorySubmit = (d) => {
        const currentCats = data.categories || [];
        const newCats = d.id ? currentCats.map(c => c.id === d.id ? { ...c, ...d } : c) : [...currentCats, { ...d, id: Date.now(), budgetedValue: 0, expenses: [], isLocked: false }];
        setData({ ...data, categories: newCats }); setIsCategoryModalOpen(false); setEditingCategory(null);
    };
    const confirmDeleteCategory = () => { if (categoryToDelete) setData({ ...data, categories: (data.categories || []).filter(c => c.id !== categoryToDelete) }); setDeleteConfirmOpen(false); setCategoryToDelete(null); };
    const confirmDeleteGroup = () => { if (groupToDelete) setData({ ...data, categories: (data.categories || []).map(c => c.group === groupToDelete ? { ...c, group: '' } : c) }); setDeleteGroupConfirmOpen(false); setGroupToDelete(null); };
    const handleUpdateGroupName = (o, n) => { setData({ ...data, categories: (data.categories || []).map(c => c.group === o ? { ...c, group: n } : c) }); setEditGroupModalOpen(false); setEditingGroup(null); };
    const handleToggleCategoryLock = (id) => { const fn = list => list.map(c => c.id === id ? { ...c, isLocked: !c.isLocked } : c); tempPresetCategories ? setTempPresetCategories(fn(tempPresetCategories)) : setData({ ...data, categories: fn(data.categories || []) }); };
    const handleMoveItem = (drag, target) => {
        let list = [...(tempPresetCategories || data.categories || [])];
        if (drag.type === 'category') {
            const idx = list.findIndex(c => c.id === drag.id); const item = list.splice(idx, 1)[0];
            if (target.type === 'group') { item.group = target.id; list.push(item); } else { item.group = target.group; list.splice(list.findIndex(c => c.id === target.id), 0, item); }
        } else if (drag.type === 'group' && target.type === 'group') {
            const grp = list.filter(c => c.group === drag.id); const others = list.filter(c => c.group !== drag.id);
            others.splice(others.findIndex(c => c.group === target.id), 0, ...grp); list = others;
        }
        tempPresetCategories ? setTempPresetCategories(list) : setData({ ...data, categories: list });
    };
    const handleUpdateCategoryBudget = (id, val, type) => {
        const v = parseFloat(String(val).replace(',', '.')) || 0;
        const final = type === 'percent' ? (data.income * v) / 100 : v;
        const list = tempPresetCategories || data.categories || [];
        const updated = list.map(c => c.id === id ? { ...c, budgetedValue: Math.max(0, final) } : c);
        tempPresetCategories ? setTempPresetCategories(updated) : setData({ ...data, categories: updated });
    };
    const handleAutoAdjust = () => {
        const cats = tempPresetCategories || data.categories || [];
        const unlocked = cats.filter(c => !c.isLocked);
        if (!unlocked.length) return;
        const lockedSum = cats.reduce((a, c) => a + (c.isLocked ? c.budgetedValue : 0), 0);
        const remain = data.income - lockedSum;
        const unlockedSum = unlocked.reduce((a, c) => a + c.budgetedValue, 0);
        let updated;
        if (unlockedSum > 0) updated = cats.map(c => c.isLocked ? c : { ...c, budgetedValue: Math.max(0, remain * (c.budgetedValue / unlockedSum)) });
        else { const eq = remain / unlocked.length; updated = cats.map(c => c.isLocked ? c : { ...c, budgetedValue: Math.max(0, eq) }); }
        const diff = data.income - updated.reduce((a,c)=>a+c.budgetedValue,0); const first = updated.findIndex(c=>!c.isLocked); if(first!==-1 && Math.abs(diff)>0.001) updated[first].budgetedValue+=diff;
        tempPresetCategories ? setTempPresetCategories(updated) : setData({ ...data, categories: updated });
    };
    const updateExp = (cid, fn) => {
        const currentCats = data.categories || [];
        const newCats = currentCats.map(c => c.id === cid ? { ...c, expenses: fn(c.expenses || []) } : c);
        setData({ ...data, categories: newCats });
        if (selectedCategory) setSelectedCategory(newCats.find(c => c.id === cid));
    };
    const handleConfirmPayment = (val) => { updateExp(selectedCategory.id, exps => exps.map(e => e.id === expenseToPay.id ? { ...e, paidInstallments: (e.paidInstallments||0)+1, installmentValue: val, paymentHistory: [...(e.paymentHistory||[]), {date: new Date().toISOString(), amount: val}] } : e)); setPaymentModalOpen(false); setExpenseToPay(null); };
    const handleImportClick = () => fileInputRef.current?.click();
    const handleFileSelect = (e) => { const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ev => { if(data.income === 0) setInitialData(JSON.parse(ev.target.result)); else { setFileToImport(ev.target.result); setImportConfirmOpen(true); } }; r.readAsText(f); e.target.value = null; };
    const handleExportData = () => { const a = document.createElement('a'); a.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`; a.download = `orcamento.json`; a.click(); };

    const catsDisplay = tempPresetCategories || data.categories || [];
    const totalBudget = catsDisplay.reduce((a, c) => a + c.budgetedValue, 0);
    const totalPct = data.income > 0 ? (totalBudget / data.income) * 100 : 0;
    const unbalanced = Math.abs(100 - totalPct) > 0.1 && catsDisplay.length > 0;
    
    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-lg font-semibold animate-pulse">Carregando suas finanças...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-200 pb-40">
            <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } .animate-pulse-border { animation: pulse-border 2s infinite; border: 2px solid; } @keyframes pulse-border { 0%, 100% { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 50% { border-color: rgba(59, 130, 246, 1); box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.2); } } @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } } .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }`}</style>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileSelect} />
                <header className="mb-8"><h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Controle de Orçamento Pessoal</h1><p className="text-center text-gray-400 mt-2">Controle suas finanças de forma simples e visual.</p></header>
                <main>
                    {selectedCategory ? (
                        <ExpenseList category={{...selectedCategory, expenses: selectedCategory.expenses || []}} onBack={() => setSelectedCategory(null)} onUpdateExpense={(cid, e) => updateExp(cid, exps => exps.map(x => x.id === e.id ? e : x))} onDeleteExpense={(cid, eid) => updateExp(cid, exps => exps.filter(x => x.id !== eid))} onAddExpense={(cid, e) => updateExp(cid, exps => [...exps, e])} onMarkAsPaid={(cid, eid) => updateExp(cid, exps => exps.map(x => x.id === eid ? { ...x, paidInstallments: (x.paidInstallments || 0) + 1 } : x))} onUndoPayment={(cid, eid) => updateExp(cid, exps => exps.map(x => { if (x.id === eid) { const h = [...(x.paymentHistory||[])]; h.pop(); return { ...x, paidInstallments: x.paidInstallments - 1, paymentHistory: h, installmentValue: h.length ? h[h.length-1].amount : x.totalValue }; } return x; }))} onOpenPaymentModal={e => { setExpenseToPay(e); setPaymentModalOpen(true); }} onDuplicateExpense={(cid, eid) => updateExp(cid, exps => { const o = exps.find(x => x.id === eid); return o ? [...exps, { ...o, id: Date.now(), description: o.description + ' (Cópia)', paidInstallments: 0, paymentHistory: [] }] : exps; })} onTogglePause={(cid, eid) => updateExp(cid, exps => exps.map(x => x.id === eid ? { ...x, isPaused: !x.isPaused } : x))} />
                    ) : (
                        <CategoryList categories={data.categories} income={data.income} onSelectCategory={setSelectedCategory} onUpdateIncome={handleUpdateIncome} onUpdateCategoryBudget={handleUpdateCategoryBudget} onOpenCategoryModal={c => { setEditingCategory(c || null); setIsCategoryModalOpen(true); }} onDeleteCategoryRequest={id => { setCategoryToDelete(id); setDeleteConfirmOpen(true); }} onDeleteGroupRequest={grp => { setGroupToDelete(grp); setDeleteGroupConfirmOpen(true); }} onOpenPresetModal={() => setIsPresetModalOpen(true)} onExport={handleExportData} onImport={handleImportClick} tempPresetCategories={tempPresetCategories} onConfirmPreset={() => { setData({ ...data, categories: tempPresetCategories }); setTempPresetCategories(null); }} onCancelPreset={() => { setTempPresetCategories(null); setIsPresetModalOpen(true); }} onToggleLock={handleToggleCategoryLock} onMoveItem={handleMoveItem} onOpenEditGroupModal={n => { setEditingGroup(n); setEditGroupModalOpen(true); }} undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
                    )}
                </main>
                <footer className="text-center mt-12 text-gray-500 text-sm"><p>Desenvolvido para facilitar sua vida financeira.</p></footer>
                <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}><CategoryForm onSubmit={handleCategorySubmit} onCancel={() => setIsCategoryModalOpen(false)} categoryData={editingCategory} existingGroups={existingGroups} /></Modal>
                <PaymentAmountModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onSubmit={handleConfirmPayment} expense={expenseToPay} />
                <ConfirmationModal isOpen={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} onConfirm={confirmDeleteCategory} title="Excluir Categoria" message="Tem certeza?" />
                <ConfirmationModal isOpen={isDeleteGroupConfirmOpen} onClose={() => setDeleteGroupConfirmOpen(false)} onConfirm={confirmDeleteGroup} title="Excluir Grupo" message="Confirma?" />
                <ConfirmationModal isOpen={isImportConfirmOpen} onClose={() => setImportConfirmOpen(false)} onConfirm={() => { setInitialData(JSON.parse(fileToImport)); setImportConfirmOpen(false); setFileToImport(null); }} title="Importar" message="Substituir dados?" />
                <PresetModal isOpen={isPresetModalOpen} onClose={() => setIsPresetModalOpen(false)} onSelectPreset={p => { setTempPresetCategories(p.categories.map(c => ({ ...c, id: Date.now() + Math.random(), budgetedValue: (data.income * c.percentage) / 100, expenses: [], isLocked: false }))); setIsPresetModalOpen(false); }} />
                <EditGroupModal isOpen={isEditGroupModalOpen} onClose={() => { setEditGroupModalOpen(false); setEditingGroup(null); }} onSubmit={handleUpdateGroupName} groupName={editingGroup} />
            </div>
            {unbalanced && !tempPresetCategories && <BudgetAdjustmentBar totalPercentage={totalPct} onAdjust={handleAutoAdjust} />}
        </div>
    );
};

window.OrcamentoPage = OrcamentoPage;
