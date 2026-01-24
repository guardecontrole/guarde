// Adaptação para rodar no navegador sem build system
const { useState, useEffect, useRef } = React;

// --- ÍCONES EMBUTIDOS (Solução Definitiva) ---
const IconBase = ({ children, size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

const ChevronRight = (props) => <IconBase {...props}><path d="m9 18 6-6-6-6"/></IconBase>;
const Folder = (props) => <IconBase {...props}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></IconBase>;
const Plus = (props) => <IconBase {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>;
const Edit = (props) => <IconBase {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></IconBase>;
const Trash2 = (props) => <IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>;
const ArrowLeft = (props) => <IconBase {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconBase>;
const DollarSign = (props) => <IconBase {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>;
const Percent = (props) => <IconBase {...props}><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></IconBase>;
const X = (props) => <IconBase {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>;
const AlertTriangle = (props) => <IconBase {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></IconBase>;
const BookOpen = (props) => <IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>;
const Star = (props) => <IconBase {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase>;
const Upload = (props) => <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></IconBase>;
const Download = (props) => <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></IconBase>;
const Check = (props) => <IconBase {...props}><path d="M20 6 9 17l-5-5"/></IconBase>;
const RefreshCw = (props) => <IconBase {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></IconBase>;
const Eye = (props) => <IconBase {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></IconBase>;
const Layers = (props) => <IconBase {...props}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/></IconBase>;
const ChevronDown = (props) => <IconBase {...props}><path d="m6 9 6 6 6-6"/></IconBase>;
const Lock = (props) => <IconBase {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></IconBase>;
const Unlock = (props) => <IconBase {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></IconBase>;
const MessageSquare = (props) => <IconBase {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></IconBase>;
const CheckCircle = (props) => <IconBase {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></IconBase>;
const Undo2 = (props) => <IconBase {...props}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></IconBase>;
const Redo2 = (props) => <IconBase {...props}><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></IconBase>;
const Pause = (props) => <IconBase {...props}><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></IconBase>;
const Play = (props) => <IconBase {...props}><polygon points="5 3 19 12 5 21 5 3"/></IconBase>;
const Copy = (props) => <IconBase {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></IconBase>;
const MoreVertical = (props) => <IconBase {...props}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></IconBase>;

// Dados iniciais para o estado da aplicação.
const initialData = {
  income: 0,
  categories: [],
};

// Paleta de cores para as categorias.
const availableColors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

// Modelos de orçamento pré-definidos
const budgetPresets = [
    {
        name: 'Sugestão do App',
        description: 'Um modelo balanceado para despesas comuns no Brasil.',
        icon: Star,
        categories: [
          { name: '🏠 Casa', percentage: 27.5, color: 'bg-blue-500', group: 'Custos de Vida' },
          { name: '👶 Filhos', percentage: 21.5, color: 'bg-green-500', group: 'Custos de Vida' },
          { name: '👤 Pessoal', percentage: 23.5, color: 'bg-purple-500', group: 'Custos de Vida' },
          { name: '🚗 Carro', percentage: 17.5, color: 'bg-red-500', group: 'Custos de Vida' },
          { name: '👵 Aposentadoria', percentage: 10.0, color: 'bg-yellow-500', group: 'Investimentos' },
        ]
    },
    {
        name: 'Pai Rico, Pai Pobre',
        description: 'Inspirado em Robert Kiyosaki, foca em "pague-se primeiro" para construir riqueza.',
        icon: BookOpen,
        categories: [
          { name: '💰 Pague-se Primeiro', percentage: 30, color: 'bg-purple-500', group: 'Investimentos' },
          { name: '✅ Necessidades', percentage: 60, color: 'bg-blue-500', group: 'Necessidades' },
          { name: '🛍️ Desejos', percentage: 10, color: 'bg-pink-500', group: 'Desejos' },
        ]
    },
    {
        name: 'Thiago Nigro (50/30/20)',
        description: 'Método para equilibrar despesas essenciais, gastos livres e investimentos.',
        icon: BookOpen,
        categories: [
          { name: '✅ Gastos Essenciais', percentage: 50, color: 'bg-blue-500', group: 'Essenciais' },
          { name: '🛍️ Gastos Não Essenciais', percentage: 30, color: 'bg-pink-500', group: 'Não Essenciais' },
          { name: '📈 Investimentos e Dívidas', percentage: 20, color: 'bg-purple-500', group: 'Investimentos' },
        ]
    },
    {
        name: 'Nathalia Arcuri (70/30)',
        description: 'A regra 70/30 dividida em "envelopes" para organizar o presente e o futuro.',
        icon: BookOpen,
        categories: [
          { name: '✅ Essenciais', percentage: 55, color: 'bg-blue-500', group: 'Orçamento do Presente' },
          { name: '📚 Educação', percentage: 5, color: 'bg-teal-500', group: 'Orçamento do Presente' },
          { name: '💸 Livre / Dívidas', percentage: 10, color: 'bg-pink-500', group: 'Orçamento do Presente' },
          { name: '🎯 Metas', percentage: 20, color: 'bg-green-500', group: 'Orçamento do Futuro' },
          { name: '👵 Aposentadoria', percentage: 10, color: 'bg-yellow-500', group: 'Orçamento do Futuro' },
        ]
    },
    {
        name: 'Bruno Perini (Foco em Aportes)',
        description: 'Prioriza a segurança e aportes diversificados. O percentual de investimento é um ponto de partida.',
        icon: BookOpen,
        categories: [
          { name: '✅ Despesas Essenciais', percentage: 60, color: 'bg-blue-500', group: 'Despesas' },
          { name: '🛍️ Despesas Livres', percentage: 20, color: 'bg-pink-500', group: 'Despesas' },
          { name: '🛡️ Fundo de Emergência', percentage: 10, color: 'bg-yellow-500', group: 'Investimentos' },
          { name: '📈 Aportes Diversificados', percentage: 10, color: 'bg-purple-500', group: 'Investimentos' },
        ]
    },
    {
        name: 'Warren Buffett (Exemplo 90/10)',
        description: 'Exemplo prático aplicando a filosofia 90/10 a 20% da renda, com foco em simplicidade e baixo custo.',
        icon: BookOpen,
        categories: [
          { name: '✅ Despesas Essenciais', percentage: 50, color: 'bg-blue-500', group: 'Despesas' },
          { name: '🛍️ Gastos Livres/Lazer', percentage: 20, color: 'bg-pink-500', group: 'Despesas' },
          { name: '🛡️ Reserva de Emergência', percentage: 10, color: 'bg-yellow-500', group: 'Investimentos' },
          { name: '📈 Investimento S&P 500 (90% do aporte)', percentage: 18, color: 'bg-purple-500', group: 'Investimentos' },
          { name: '🏦 Investimento Renda Fixa (10% do aporte)', percentage: 2, color: 'bg-teal-500', group: 'Investimentos' },
        ]
    }
];

// Hook personalizado
const useHistoryState = (initialState) => {
    const [state, setState] = useState({
        past: [],
        present: initialState,
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = () => {
        if (!canUndo) return;
        const newFuture = [state.present, ...state.future];
        const newPresent = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, state.past.length - 1);
        setState({ past: newPast, present: newPresent, future: newFuture });
    };

    const redo = () => {
        if (!canRedo) return;
        const newPast = [...state.past, state.present];
        const newPresent = state.future[0];
        const newFuture = state.future.slice(1);
        setState({ past: newPast, present: newPresent, future: newFuture });
    };

    const set = (newPresent) => {
        if (JSON.stringify(newPresent) === JSON.stringify(state.present)) return;
        setState({
            past: [...state.past, state.present],
            present: newPresent,
            future: [],
        });
    };
    
    const setInitial = (newPresent) => {
        setState({ past: [], present: newPresent, future: [] });
    }

    return { state: state.present, set, undo, redo, canUndo, canRedo, setInitial };
};

// Helper
const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) value = 0;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Componentes UI
const Modal = ({ children, isOpen, onClose, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className={`bg-gray-800 rounded-2xl shadow-2xl w-full ${maxWidth} m-4`}>
        <div className="relative p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-white flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-yellow-500/20 rounded-full mb-4">
                <AlertTriangle size={40} className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex justify-center space-x-4 w-full">
                <button type="button" onClick={onClose} className="flex-1 px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                <button type="button" onClick={onConfirm} className="flex-1 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Confirmar</button>
            </div>
        </div>
    </Modal>
  );
};

const PaymentAmountModal = ({ isOpen, onClose, onSubmit, expense }) => {
    const [amount, setAmount] = useState('');
    useEffect(() => {
        if (isOpen && expense) {
            setAmount(String(expense.installmentValue || '').replace('.', ','));
        }
    }, [isOpen, expense]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(String(amount).replace(',', '.'));
        if (!isNaN(parsedAmount) && parsedAmount >= 0) onSubmit(parsedAmount);
    };
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 text-white">
                <h3 className="text-xl font-bold">Registrar Pagamento</h3>
                <p>Qual foi o valor pago para a despesa <span className="font-bold">{expense?.description}</span>?</p>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Valor Pago (R$)</label>
                    <input type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required autoFocus />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Confirmar Pagamento</button>
                </div>
            </form>
        </Modal>
    );
};

const PresetModal = ({ isOpen, onClose, onSelectPreset }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
            <div className="text-white">
                <h3 className="text-2xl font-bold mb-2 text-center">Escolha um Modelo de Orçamento</h3>
                <p className="text-gray-400 mb-8 text-center">Comece rapidamente com um modelo pré-definido por especialistas.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgetPresets.map(preset => {
                        const Icon = preset.icon;
                        return (
                            <div key={preset.name} onClick={() => onSelectPreset(preset)} className="bg-gray-700/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-700 cursor-pointer transition-all flex flex-col">
                                <div className="flex items-center mb-3">
                                    <Icon className="text-blue-400 mr-3" size={24} />
                                    <h4 className="text-lg font-bold">{preset.name}</h4>
                                </div>
                                <p className="text-gray-400 text-sm mb-4 flex-grow">{preset.description}</p>
                                <ul className="space-y-2 text-sm">
                                    {preset.categories.map(cat => (
                                        <li key={cat.name} className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-3 ${cat.color}`}></div>
                                            <span className="text-gray-300 truncate" title={cat.name}>{cat.name}</span>
                                            <span className="ml-auto font-mono text-gray-400">{cat.percentage}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Modal>
    );
};

const EditGroupModal = ({ isOpen, onClose, onSubmit, groupName }) => {
    const [newGroupName, setNewGroupName] = useState(groupName || '');
    useEffect(() => { if (isOpen) setNewGroupName(groupName); }, [isOpen, groupName]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newGroupName.trim() && newGroupName.trim() !== groupName) onSubmit(groupName, newGroupName.trim());
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6 text-white">
                <h3 className="text-xl font-bold">Editar Nome do Grupo</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Novo nome para "{groupName}"</label>
                    <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required autoFocus />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Salvar Alterações</button>
                </div>
            </form>
        </Modal>
    );
};

const CategoryForm = ({ onSubmit, onCancel, categoryData, existingGroups = [] }) => {
    const [name, setName] = useState(categoryData?.name || '');
    const [group, setGroup] = useState(categoryData?.group || '');
    const [color, setColor] = useState(categoryData?.color || availableColors[0]);
    const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...categoryData, name, group, color }); };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">{categoryData?.id ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Categoria</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Grupo (Opcional)</label>
                <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Digite ou selecione um grupo existente" className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" list="group-suggestions" />
                <datalist id="group-suggestions">{existingGroups.map(g => (<option key={g} value={g} />))}</datalist>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cor</label>
                <div className="flex flex-wrap gap-3">{availableColors.map(c => (<div key={c} onClick={() => setColor(c)} className={`w-10 h-10 rounded-full cursor-pointer ${c} transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}></div>))}</div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Salvar</button>
            </div>
        </form>
    );
};

const ExpenseForm = ({ onSubmit, onCancel, expenseData }) => {
    const [description, setDescription] = useState(expenseData?.description || '');
    const [totalValue, setTotalValue] = useState(expenseData?.totalValue || '');
    const [installments, setInstallments] = useState(expenseData?.installments > 1 && expenseData?.installments < 9999 ? expenseData.installments : 1);
    const [status, setStatus] = useState(expenseData?.status || 'Andamento');
    const [startDate, setStartDate] = useState(expenseData?.startDate || new Date().toISOString().split('T')[0]);
    const [observation, setObservation] = useState(expenseData?.observation || '');
    const [finalInstallmentDate, setFinalInstallmentDate] = useState(null);

    useEffect(() => {
        if (status === 'Andamento' && startDate && installments > 1) {
            const parsedInstallments = parseInt(installments, 10);
            if (!isNaN(parsedInstallments) && parsedInstallments > 1) {
                const start = new Date(startDate);
                const final = new Date(start.getFullYear(), start.getMonth() + parsedInstallments - 1, start.getDate() + 1);
                setFinalInstallmentDate(final);
            } else setFinalInstallmentDate(null);
        } else setFinalInstallmentDate(null);
    }, [startDate, installments, status]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedValue = parseFloat(String(totalValue).replace(',', '.')) || 0;
        let expensePayload = { id: expenseData?.id || Date.now(), description, status, startDate, observation, paidInstallments: expenseData?.paidInstallments || 0, isPaused: expenseData?.isPaused || false };
        if (status === 'Andamento') {
            const parsedInstallments = parseInt(installments, 10) || 1;
            expensePayload = { ...expensePayload, totalValue: parsedValue, installments: parsedInstallments, installmentValue: parsedInstallments > 0 ? parsedValue / parsedInstallments : parsedValue };
        } else if (status === 'Fixa-Variável') {
            expensePayload = { ...expensePayload, totalValue: parsedValue, installments: 9999, installmentValue: parsedValue, paymentHistory: expenseData?.paymentHistory || [] };
        } else {
            expensePayload = { ...expensePayload, totalValue: parsedValue, installments: status === 'Fixo' ? 9999 : 1, installmentValue: parsedValue };
        }
        onSubmit(expensePayload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">{expenseData ? 'Editar Despesa' : 'Adicionar Despesa'}</h3>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required /></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">{status === 'Andamento' ? 'Valor Total da Compra' : 'Valor da Despesa (ou 1º Pagamento)'}</label><input type="text" inputMode="decimal" value={String(totalValue).replace('.', ',')} onChange={(e) => setTotalValue(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required /></div>
            <div className={`grid ${status === 'Andamento' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {status === 'Andamento' && (<div><label className="block text-sm font-medium text-gray-400 mb-1">Nº de Parcelas</label><input type="number" value={installments} onChange={(e) => setInstallments(e.target.value)} min="1" className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />{finalInstallmentDate && (<p className="text-xs text-gray-400 mt-2">Última parcela em: {finalInstallmentDate.toLocaleDateString('pt-BR')}</p>)}</div>)}
                <div><label className="block text-sm font-medium text-gray-400 mb-1">{status === 'Andamento' ? 'Data da 1ª Parcela' : 'Data do Vencimento'}</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Despesa</label><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"><option value="Andamento">Andamento (Parcelado)</option><option value="Fixo">Fixo (Valor Fixo)</option><option value="Fixa-Variável">Fixo (Valor Variável)</option><option value="Variável">Variável (Pagamento Único)</option></select></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Observação (Opcional)</label><textarea value={observation} onChange={(e) => setObservation(e.target.value)} rows="3" className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea></div>
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button><button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Salvar</button></div>
        </form>
    );
};

const ExpenseList = ({ category, onBack, onUpdateExpense, onDeleteExpense, onAddExpense, onMarkAsPaid, onUndoPayment, onOpenPaymentModal, onTogglePause, onDuplicateExpense }) => {
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedExpenseForAction, setSelectedExpenseForAction] = useState(null);

    const openActionsModal = (expense) => { setSelectedExpenseForAction(expense); setIsActionModalOpen(true); };
    const closeActionsModal = () => { setIsActionModalOpen(false); setSelectedExpenseForAction(null); };
    const handleAddClick = () => { setEditingExpense(null); setExpenseModalOpen(true); };
    const handleEditClick = (expense) => { setEditingExpense(expense); setExpenseModalOpen(true); closeActionsModal(); };
    const handleDeleteRequest = (expenseId) => { setExpenseToDelete(expenseId); setConfirmationModalOpen(true); closeActionsModal(); };
    const confirmDelete = () => { onDeleteExpense(category.id, expenseToDelete); setConfirmationModalOpen(false); setExpenseToDelete(null); };
    const handleFormSubmit = (expenseData) => { if (editingExpense) onUpdateExpense(category.id, expenseData); else onAddExpense(category.id, expenseData); setExpenseModalOpen(false); setEditingExpense(null); };

    const totalCategoryValue = category.expenses.filter(exp => !exp.isPaused).reduce((sum, exp) => sum + exp.installmentValue, 0);
    const budgetedValue = category.budgetedValue || 0;
    const availableValue = budgetedValue - totalCategoryValue;

    return (
        <div className="bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 rounded-2xl animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center"><button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700 transition mr-4"><ArrowLeft size={24} /></button><div className={`w-4 h-8 rounded mr-3 ${category.color}`}></div><h2 className="text-2xl sm:text-3xl font-bold text-white flex-grow">{category.name}</h2></div>
                <div className="flex-shrink-0 grid grid-cols-3 gap-4 sm:gap-6 text-right w-full sm:w-auto">
                    <div><p className="text-gray-400 text-sm">Orçado</p><p className="text-xl font-bold text-white">{formatCurrency(budgetedValue)}</p></div>
                    <div><p className="text-gray-400 text-sm">Gasto</p><p className="text-xl font-bold text-red-400">{formatCurrency(totalCategoryValue)}</p></div>
                    <div><p className="text-gray-400 text-sm">Disponível</p><p className={`text-xl font-bold ${availableValue >= 0 ? 'text-green-400' : 'text-yellow-400'}`}>{formatCurrency(availableValue)}</p></div>
                </div>
            </div>
            <div className="flex justify-end mb-6"><button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-transform transform hover:scale-105 shadow-lg"><Plus size={20} /> Adicionar Despesa</button></div>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="border-b-2 border-gray-700"><tr className="text-sm text-gray-400"><th className="p-3">Descrição</th><th className="p-3 text-right">Valor Mensal</th><th className="p-3 text-center">Progresso</th><th className="p-3 text-center">Status</th><th className="p-3 text-center">Ações</th></tr></thead>
                    <tbody>
                        {category.expenses.length === 0 ? (<tr><td colSpan="5" className="text-center py-10 text-gray-500">Nenhuma despesa adicionada.</td></tr>) : category.expenses.map(expense => {
                            const isPaused = expense.isPaused;
                            const paidInstallments = expense.paidInstallments || 0;
                            const isComplete = paidInstallments >= expense.installments;
                            let dueDate = null, isOverdue = false;
                            if (expense.startDate) {
                                const startDate = new Date(expense.startDate);
                                dueDate = new Date(startDate.getFullYear(), startDate.getMonth() + paidInstallments, startDate.getDate() + 1);
                                const today = new Date(); today.setHours(0,0,0,0);
                                if (today > dueDate && !isComplete && !isPaused) isOverdue = true;
                            }
                            const remainingValue = (expense.installments - paidInstallments) * expense.installmentValue;
                            const displayStatus = isPaused ? 'Pausado' : isComplete ? 'Pago' : (isOverdue ? 'Atrasado' : expense.status);
                            return (
                                <tr key={expense.id} className={`border-b border-gray-800 transition-colors ${isPaused ? 'bg-gray-800/60' : 'hover:bg-gray-800/50'} ${isOverdue && !isPaused ? 'bg-red-900/30' : ''}`}>
                                    <td className={`p-3 font-medium text-white transition-opacity ${isPaused ? 'opacity-60' : ''}`}>
                                        <div className="flex items-center gap-2"><span>{expense.description}</span>{expense.observation && (<div className="relative group flex-shrink-0"><MessageSquare size={14} className="text-gray-500 cursor-pointer" /><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 border border-gray-700 text-white text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl"><p>{expense.observation}</p></div></div>)}</div>
                                        {isOverdue && dueDate && <div className="text-xs text-red-400 font-semibold mt-1">Vencido em: {dueDate.toLocaleDateString('pt-BR')}</div>}
                                    </td>
                                    <td className={`p-3 text-right font-semibold text-blue-400 transition-opacity ${isPaused ? 'opacity-60' : ''}`}>{formatCurrency(expense.installmentValue)}</td>
                                    <td className={`p-3 text-center text-gray-300 transition-opacity ${isPaused ? 'opacity-60' : ''}`}>{(() => { if (expense.status === 'Variável') return <span>Pag. Única</span>; if (expense.status === 'Fixo') return isComplete ? <span>Pago</span> : (dueDate ? <span className="text-xs">Próx. Venc: {dueDate.toLocaleDateString('pt-BR')}</span> : <span className="text-xs text-gray-500">Sem data</span>); if (expense.status === 'Fixa-Variável') return <div>{dueDate && <span className="text-xs">Próx. Venc: {dueDate.toLocaleDateString('pt-BR')}</span>}</div>; return <div><span className="font-mono">{paidInstallments} / {expense.installments}</span><div className="text-xs text-gray-500">Falta: {formatCurrency(remainingValue)}</div></div>; })()}</td>
                                    <td className={`p-3 text-center transition-opacity ${isPaused ? 'opacity-60' : ''}`}><span className={`px-3 py-1 text-xs font-bold rounded-full ${displayStatus === 'Pausado' ? 'bg-gray-600/50 text-gray-400' : displayStatus === 'Pago' ? 'bg-green-500/20 text-green-400' : displayStatus === 'Atrasado' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-300'}`}>{displayStatus}</span></td>
                                    <td className="p-3"><div className="flex justify-center items-center"><div className={`transition-opacity ${isPaused ? 'opacity-60' : ''}`}>{!isComplete && (<button onClick={() => expense.status === 'Fixa-Variável' ? onOpenPaymentModal(expense) : onMarkAsPaid(category.id, expense.id)} disabled={isPaused} className="p-2 text-green-400 hover:bg-green-500/20 rounded-md transition disabled:cursor-not-allowed disabled:text-gray-600"><CheckCircle size={18} /></button>)}</div><button onClick={() => openActionsModal(expense)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"><MoreVertical size={18} /></button></div></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)}><ExpenseForm onSubmit={handleFormSubmit} onCancel={() => setExpenseModalOpen(false)} expenseData={editingExpense} /></Modal>
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} onConfirm={confirmDelete} title="Excluir Despesa" message="Tem certeza?" />
            <Modal isOpen={isActionModalOpen} onClose={closeActionsModal} maxWidth="max-w-sm">{selectedExpenseForAction && (<div className="text-white"><h3 className="text-lg font-bold mb-4 text-center">Ações para "{selectedExpenseForAction.description}"</h3><div className="flex flex-col gap-2"><button onClick={() => handleEditClick(selectedExpenseForAction)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 rounded-md"><Edit size={16} /> Editar</button><button onClick={() => { onDuplicateExpense(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 rounded-md"><Copy size={16} /> Duplicar</button><button onClick={() => { onTogglePause(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 rounded-md">{selectedExpenseForAction.isPaused ? <Play size={16} /> : <Pause size={16} />} {selectedExpenseForAction.isPaused ? 'Reativar' : 'Pausar'}</button>{(selectedExpenseForAction.paidInstallments || 0) > 0 && (<button onClick={() => { onUndoPayment(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-yellow-400 hover:bg-yellow-500/20 rounded-md"><Undo2 size={16} /> Desfazer Pagamento</button>)}<div className="w-full h-px bg-gray-600 my-1"></div><button onClick={() => handleDeleteRequest(selectedExpenseForAction.id)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-md"><Trash2 size={16} /> Excluir</button></div></div>)}</Modal>
        </div>
    );
};

const CategoryItem = ({ category, income, onUpdateBudget, onSelectCategory, onEdit, onDelete, isPreviewing, onToggleLock, dragProps }) => {
    const [inputValue, setInputValue] = useState('0,00');
    const [inputPercent, setInputPercent] = useState('0,0');
    const [editMode, setEditMode] = useState('value');

    useEffect(() => {
        const newBudgetValue = category.budgetedValue || 0;
        const newPercentage = income > 0 ? (newBudgetValue / income) * 100 : 0;
        setInputValue(newBudgetValue.toFixed(2).replace('.', ','));
        setInputPercent(newPercentage.toFixed(1).replace('.', ','));
    }, [category.budgetedValue, income]);

    const handleValueChange = (e) => { setInputValue(e.target.value); };
    const handlePercentageChange = (e) => { setInputPercent(e.target.value); };
    const handleBlur = (source) => { if (category.isLocked) return; onUpdateBudget(category.id, source === 'value' ? inputValue : inputPercent, source); };

    const actualExpenses = category.expenses.filter(exp => !exp.isPaused).reduce((sum, exp) => sum + exp.installmentValue, 0);
    const remaining = (category.budgetedValue || 0) - actualExpenses;
    const isOverBudget = remaining < 0;
    const progressBarWidth = (category.budgetedValue || 0) > 0 ? Math.min((actualExpenses / (category.budgetedValue || 0)) * 100, 100) : 0;
    const isBeingDragged = dragProps.draggedItem?.id === category.id;
    const isDragTarget = dragProps.dragOverItem?.id === category.id;

    return (
        <div draggable={!isPreviewing} onDragStart={() => dragProps.onDragStart({ id: category.id, type: 'category', group: category.group || null })} onDragEnd={dragProps.onDragEnd} onDrop={(e) => { e.preventDefault(); dragProps.onDrop({ id: category.id, type: 'category', group: category.group || null }); }} onDragOver={(e) => { e.preventDefault(); dragProps.onDragEnter({ id: category.id, type: 'category', group: category.group || null }); }} className={`bg-gray-700/50 rounded-xl transition-all group relative p-4 ${!isPreviewing ? 'cursor-grab' : ''} ${isPreviewing ? 'opacity-70' : ''} ${category.isLocked ? 'border-2 border-yellow-500/50' : 'border-2 border-transparent'} ${isBeingDragged ? 'opacity-50' : 'opacity-100'}`}>
            {isDragTarget && !isBeingDragged && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full animate-pulse"></div>}
            <div className="flex items-center justify-between">
                <div onClick={() => !isPreviewing && onSelectCategory(category)} className={`flex items-center flex-grow mr-4 min-w-0 ${!isPreviewing ? 'cursor-pointer' : 'cursor-default'}`}><div className={`w-3 h-6 rounded-sm mr-4 flex-shrink-0 ${category.color}`}></div><Folder size={20} className="text-gray-400 mr-3 hidden sm:block flex-shrink-0" /><span className="font-semibold text-white truncate">{category.name}</span></div>
                <div className="flex items-center flex-shrink-0"><button onClick={() => !isPreviewing && onToggleLock(category.id)} disabled={isPreviewing} className={`p-2 text-gray-400 transition ${category.isLocked ? 'text-yellow-400' : 'hover:text-white'}`}>{category.isLocked ? <Lock size={18} /> : <Unlock size={18} />}</button><button onClick={() => !isPreviewing && onEdit(category)} disabled={isPreviewing || category.isLocked} className="p-2 text-gray-400 hover:text-blue-400 transition"><Edit size={18} /></button><button onClick={() => !isPreviewing && onDelete(category.id)} disabled={isPreviewing} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18} /></button>{!isPreviewing && <ChevronRight size={20} className="text-gray-500 ml-2 group-hover:text-white transition" onClick={() => onSelectCategory(category)} />}</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
                {editMode === 'value' ? (<><div className="relative flex-grow"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span><input type="text" inputMode="decimal" value={inputValue} onBlur={() => handleBlur('value')} onChange={handleValueChange} disabled={isPreviewing || category.isLocked} className="w-full bg-gray-700 text-white rounded-lg p-2 pl-9 border border-gray-600 focus:ring-2 focus:ring-blue-500 transition" /></div><div className="flex-shrink-0 bg-gray-800/60 text-gray-300 font-semibold text-base rounded-lg px-4 py-[9px]"><span>{inputPercent}%</span></div></>) : (<><div className="relative flex-grow"><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span><input type="text" inputMode="decimal" value={inputPercent} onBlur={() => handleBlur('percent')} onChange={handlePercentageChange} disabled={isPreviewing || category.isLocked} className="w-full bg-gray-700 text-white rounded-lg p-2 pr-8 border border-gray-600 focus:ring-2 focus:ring-blue-500 transition" /></div><div className="flex-shrink-0 bg-gray-800/60 text-gray-300 font-semibold text-base rounded-lg px-4 py-[9px]"><span>{formatCurrency(parseFloat(inputValue.replace(',', '.')))}</span></div></>)}
                <button onClick={() => setEditMode(prev => prev === 'value' ? 'percent' : 'value')} disabled={isPreviewing || category.isLocked} className="p-2 text-gray-400 bg-gray-700 rounded-lg hover:text-blue-400 transition"><RefreshCw size={18} /></button>
            </div>
            <div className="mt-3 text-xs flex justify-between text-gray-400"><span>Gasto: {formatCurrency(actualExpenses)}</span><span className={isOverBudget ? 'text-red-400 font-bold' : 'text-green-400'}>{isOverBudget ? `Estourado: ${formatCurrency(Math.abs(remaining))}` : `Sobra: ${formatCurrency(remaining)}`}</span></div>
            <div className="w-full bg-gray-600 h-2 rounded-full"><div className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : category.color}`} style={{ width: `${progressBarWidth}%` }}></div></div>
        </div>
    );
};

const PresetConfirmationBar = ({ onConfirm, onCancel }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm p-4 z-40 animate-fade-in"><div className="container mx-auto max-w-5xl flex justify-between items-center"><p className="text-white font-semibold">Gostou desta sugestão de orçamento?</p><div className="flex gap-4"><button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"><RefreshCw size={18} /> Cancelar</button><button onClick={onConfirm} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"><Check size={20} /> Confirmar</button></div></div></div>
);

const BudgetAdjustmentBar = ({ totalPercentage, onAdjust }) => {
    const diff = Math.abs(100 - totalPercentage).toFixed(1);
    const isOver = totalPercentage > 100;
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm p-4 z-40 animate-fade-in border-t-2 border-yellow-500 shadow-2xl"><div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-3"><div className="flex items-center gap-3 text-yellow-300"><AlertTriangle size={24} /><p className="font-semibold text-white">{isOver ? `Orçamento ${diff}% acima.` : `Faltam ${diff}%.`}</p></div><button onClick={onAdjust} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500"><RefreshCw size={18} /> Ajustar</button></div></div>
    );
};

// Componente Principal da Aplicação.
const OrcamentoPage = ({ initialIncome = 0 }) => {
    const { state: data, set: setData, undo, redo, canUndo, canRedo, setInitial: setInitialData } = useHistoryState(initialData);
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

    const existingGroups = [...new Set(data.categories.map(c => c.group).filter(g => g && g.trim() !== ''))];

    // --- AUTOMAÇÃO: Sincroniza Saldo Sugerido com a Receita ---
    useEffect(() => {
        if (initialIncome > 0 && Math.abs(initialIncome - data.income) > 0.01) {
            handleUpdateIncome(initialIncome);
        }
    }, [initialIncome]);

    const handleUpdateIncome = (newIncome) => {
        if (data.income === newIncome) return;
        const newCategories = data.categories.map(cat => {
            if (cat.isLocked || data.income <= 0) return cat;
            const percentage = (cat.budgetedValue || 0) / (data.income || 1);
            return { ...cat, budgetedValue: newIncome * percentage };
        });
        setData({ income: newIncome, categories: newCategories });
    };

    const handleCategorySubmit = (d) => {
        const newCats = d.id ? data.categories.map(c => c.id === d.id ? { ...c, ...d } : c) : [...data.categories, { ...d, id: Date.now(), budgetedValue: 0, expenses: [], isLocked: false }];
        setData({ ...data, categories: newCats }); setIsCategoryModalOpen(false); setEditingCategory(null);
    };
    const confirmDeleteCategory = () => { if (categoryToDelete) setData({ ...data, categories: data.categories.filter(c => c.id !== categoryToDelete) }); setDeleteConfirmOpen(false); setCategoryToDelete(null); };
    const confirmDeleteGroup = () => { if (groupToDelete) setData({ ...data, categories: data.categories.map(c => c.group === groupToDelete ? { ...c, group: '' } : c) }); setDeleteGroupConfirmOpen(false); setGroupToDelete(null); };
    const handleUpdateGroupName = (o, n) => { setData({ ...data, categories: data.categories.map(c => c.group === o ? { ...c, group: n } : c) }); setEditGroupModalOpen(false); setEditingGroup(null); };
    const handleToggleCategoryLock = (id) => { const fn = list => list.map(c => c.id === id ? { ...c, isLocked: !c.isLocked } : c); tempPresetCategories ? setTempPresetCategories(fn(tempPresetCategories)) : setData({ ...data, categories: fn(data.categories) }); };
    const handleMoveItem = (drag, target) => {
        let list = [...(tempPresetCategories || data.categories)];
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
        const list = tempPresetCategories || data.categories;
        const updated = list.map(c => c.id === id ? { ...c, budgetedValue: Math.max(0, final) } : c);
        tempPresetCategories ? setTempPresetCategories(updated) : setData({ ...data, categories: updated });
    };
    const handleAutoAdjust = () => {
        const cats = tempPresetCategories || data.categories;
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
        const newCats = data.categories.map(c => c.id === cid ? { ...c, expenses: fn(c.expenses) } : c);
        setData({ ...data, categories: newCats });
        if (selectedCategory) setSelectedCategory(newCats.find(c => c.id === cid));
    };
    const handleConfirmPayment = (val) => { updateExp(selectedCategory.id, exps => exps.map(e => e.id === expenseToPay.id ? { ...e, paidInstallments: (e.paidInstallments||0)+1, installmentValue: val, paymentHistory: [...(e.paymentHistory||[]), {date: new Date().toISOString(), amount: val}] } : e)); setPaymentModalOpen(false); setExpenseToPay(null); };
    const handleImportClick = () => fileInputRef.current?.click();
    const handleFileSelect = (e) => { const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ev => { if(data.income === 0) setInitialData(JSON.parse(ev.target.result)); else { setFileToImport(ev.target.result); setImportConfirmOpen(true); } }; r.readAsText(f); e.target.value = null; };
    const handleExportData = () => { const a = document.createElement('a'); a.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`; a.download = `orcamento.json`; a.click(); };

    const catsDisplay = tempPresetCategories || data.categories;
    const totalBudget = catsDisplay.reduce((a, c) => a + c.budgetedValue, 0);
    const totalPct = data.income > 0 ? (totalBudget / data.income) * 100 : 0;
    const unbalanced = Math.abs(100 - totalPct) > 0.1 && catsDisplay.length > 0;

    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-200 pb-40">
            <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } .animate-pulse-border { animation: pulse-border 2s infinite; border: 2px solid; } @keyframes pulse-border { 0%, 100% { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 50% { border-color: rgba(59, 130, 246, 1); box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.2); } } @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } } .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }`}</style>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileSelect} />
                <header className="mb-8"><h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Controle de Orçamento Pessoal</h1><p className="text-center text-gray-400 mt-2">Controle suas finanças de forma simples e visual.</p></header>
                <main>
                    {selectedCategory ? (
                        <ExpenseList category={{...selectedCategory, expenses: selectedCategory.expenses || []}} onBack={() => setSelectedCategory(null)} onUpdateExpense={(cid, e) => updateExp(cid, exps => exps.map(x => x.id === e.id ? e : x))} onDeleteExpense={(cid, eid) => updateExp(cid, exps => exps.filter(x => x.id !== eid))} onAddExpense={(cid, e) => updateExp(cid, exps => [...exps, e])} onMarkAsPaid={(cid, eid) => updateExp(cid, exps => exps.map(x => x.id === eid ? { ...x, paidInstallments: (x.paidInstallments || 0) + 1 } : x))} onUndoPayment={(cid, eid) => updateExp(cid, exps => exps.map(x => { if (x.id === eid) { const h = [...(x.paymentHistory||[])]; h.pop(); return { ...x, paidInstallments: x.paidInstallments - 1, paymentHistory: h, installmentValue: h.length ? h[h.length-1].amount : x.totalValue }; } return x; }))} onOpenPaymentModal={e => { setExpenseToPay(e); setPaymentModalOpen(true); }} onTogglePause={(cid, eid) => updateExp(cid, exps => exps.map(x => x.id === eid ? { ...x, isPaused: !x.isPaused } : x))} onDuplicateExpense={(cid, eid) => updateExp(cid, exps => { const o = exps.find(x => x.id === eid); return o ? [...exps, { ...o, id: Date.now(), description: o.description + ' (Cópia)', paidInstallments: 0, paymentHistory: [] }] : exps; })} />
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
