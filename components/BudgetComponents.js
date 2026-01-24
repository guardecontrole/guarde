// components/BudgetComponents.js
const { useState, useEffect, useRef } = React;

// --- IMPORTAÇÃO CORRIGIDA ---
// Agora inclui ArrowLeft e Plus que estavam faltando
const { 
    X, AlertTriangle, ChevronRight, Folder, Edit, Trash2, Lock, Unlock, 
    RefreshCw, MessageSquare, CheckCircle, MoreVertical, Play, Pause, 
    Undo2, Copy, Star, BookOpen, Check, ArrowLeft, Plus 
} = window.BudgetIcons;

// Helpers e Constantes
const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) value = 0;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const availableColors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

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
        if (isOpen && expense) setAmount(String(expense.installmentValue || '').replace('.', ','));
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
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Confirmar</button>
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
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Salvar</button>
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
                <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Digite ou selecione" className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" list="group-suggestions" />
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
            <div><label className="block text-sm font-medium text-gray-400 mb-1">{status === 'Andamento' ? 'Valor Total da Compra' : 'Valor (ou 1º Pagamento)'}</label><input type="text" inputMode="decimal" value={String(totalValue).replace('.', ',')} onChange={(e) => setTotalValue(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required /></div>
            <div className={`grid ${status === 'Andamento' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {status === 'Andamento' && (<div><label className="block text-sm font-medium text-gray-400 mb-1">Nº Parcelas</label><input type="number" value={installments} onChange={(e) => setInstallments(e.target.value)} min="1" className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />{finalInstallmentDate && (<p className="text-xs text-gray-400 mt-2">Final: {finalInstallmentDate.toLocaleDateString('pt-BR')}</p>)}</div>)}
                <div><label className="block text-sm font-medium text-gray-400 mb-1">Data Início/Venc</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"><option value="Andamento">Andamento (Parcelado)</option><option value="Fixo">Fixo (Valor Fixo)</option><option value="Fixa-Variável">Fixo (Valor Variável)</option><option value="Variável">Variável (Único)</option></select></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1">Obs</label><textarea value={observation} onChange={(e) => setObservation(e.target.value)} rows="3" className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea></div>
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
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700 transition mr-4"><ArrowLeft size={24} /></button>
                    <div className={`w-4 h-8 rounded mr-3 ${category.color}`}></div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex-grow">{category.name}</h2>
                </div>
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
                                    <td className={`p-3 text-center text-gray-300 transition-opacity ${isPaused ? 'opacity-60' : ''}`}>{expense.status === 'Variável' ? <span>Pag. Única</span> : expense.status === 'Fixo' ? (isComplete ? <span>Pago</span> : dueDate ? <span className="text-xs">Venc: {dueDate.toLocaleDateString('pt-BR')}</span> : <span className="text-xs">Sem data</span>) : expense.status === 'Fixa-Variável' ? <div>{dueDate && <span className="text-xs">Venc: {dueDate.toLocaleDateString('pt-BR')}</span>}</div> : <div><span className="font-mono">{paidInstallments} / {expense.installments}</span><div className="text-xs text-gray-500">Falta: {formatCurrency(remainingValue)}</div></div>}</td>
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
        setInputValue(newBudgetValue.toFixed(2).replace('.', ','));
        setInputPercent(income > 0 ? ((newBudgetValue / income) * 100).toFixed(1).replace('.', ',') : '0,0');
    }, [category.budgetedValue, income]);

    const handleBlur = (source) => {
        if (category.isLocked) return;
        onUpdateBudget(category.id, source === 'value' ? inputValue : inputPercent, source);
    };

    const actualExpenses = category.expenses.filter(exp => !exp.isPaused).reduce((sum, exp) => sum + exp.installmentValue, 0);
    const remaining = (category.budgetedValue || 0) - actualExpenses;
    const isOverBudget = remaining < 0;
    const progressBarWidth = (category.budgetedValue || 0) > 0 ? Math.min((actualExpenses / (category.budgetedValue || 0)) * 100, 100) : 0;
    const isBeingDragged = dragProps.draggedItem?.id === category.id;
    const isDragTarget = dragProps.dragOverItem?.id === category.id;

    return (
        <div draggable={!isPreviewing} onDragStart={() => dragProps.onDragStart({ id: category.id, type: 'category', group: category.group || null })} onDragEnd={() => dragProps.onDragEnd()} onDrop={(e) => { e.preventDefault(); dragProps.onDrop({ id: category.id, type: 'category', group: category.group || null }); }} onDragOver={(e) => { e.preventDefault(); dragProps.onDragEnter({ id: category.id, type: 'category', group: category.group || null }); }} onDragLeave={(e) => { e.preventDefault(); dragProps.onDragLeave(); }} className={`bg-gray-700/50 rounded-xl transition-all group relative p-4 ${!isPreviewing ? 'cursor-grab' : ''} ${isPreviewing ? 'opacity-70' : ''} ${category.isLocked ? 'border-2 border-yellow-500/50' : 'border-2 border-transparent'} ${isBeingDragged ? 'opacity-50' : 'opacity-100'}`}>
            {isDragTarget && !isBeingDragged && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full animate-pulse"></div>}
            <div className="flex items-center justify-between">
                <div onClick={() => !isPreviewing && onSelectCategory(category)} className={`flex items-center flex-grow mr-4 min-w-0 ${!isPreviewing ? 'cursor-pointer' : 'cursor-default'}`}><div className={`w-3 h-6 rounded-sm mr-4 flex-shrink-0 ${category.color}`}></div><Folder size={20} className="text-gray-400 mr-3 hidden sm:block flex-shrink-0" /><span className="font-semibold text-white truncate">{category.name}</span></div>
                <div className="flex items-center flex-shrink-0"><button onClick={() => !isPreviewing && onToggleLock(category.id)} disabled={isPreviewing} className={`p-2 text-gray-400 transition ${category.isLocked ? 'text-yellow-400' : 'hover:text-white'}`}>{category.isLocked ? <Lock size={18} /> : <Unlock size={18} />}</button><button onClick={() => !isPreviewing && onEdit(category)} disabled={isPreviewing || category.isLocked} className="p-2 text-gray-400 hover:text-blue-400 transition"><Edit size={18} /></button><button onClick={() => !isPreviewing && onDelete(category.id)} disabled={isPreviewing} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18} /></button>{!isPreviewing && <ChevronRight size={20} className="text-gray-500 ml-2 group-hover:text-white transition" onClick={() => onSelectCategory(category)} />}</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">{editMode === 'value' ? (<><div className="relative flex-grow"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span><input type="text" inputMode="decimal" value={inputValue} onBlur={() => handleBlur('value')} onChange={(e) => setInputValue(e.target.value)} disabled={isPreviewing || category.isLocked} className="w-full bg-gray-700 text-white rounded-lg p-2 pl-9 border border-gray-600 focus:ring-2 focus:ring-blue-500 transition" /></div><div className="flex-shrink-0 bg-gray-800/60 text-gray-300 font-semibold text-base rounded-lg px-4 py-[9px]"><span>{inputPercent}%</span></div></>) : (<><div className="relative flex-grow"><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span><input type="text" inputMode="decimal" value={inputPercent} onBlur={() => handleBlur('percent')} onChange={(e) => setInputPercent(e.target.value)} disabled={isPreviewing || category.isLocked} className="w-full bg-gray-700 text-white rounded-lg p-2 pr-8 border border-gray-600 focus:ring-2 focus:ring-blue-500 transition" /></div><div className="flex-shrink-0 bg-gray-800/60 text-gray-300 font-semibold text-base rounded-lg px-4 py-[9px]"><span>{formatCurrency(parseFloat(inputValue.replace(',', '.')))}</span></div></>)}<button onClick={() => setEditMode(prev => prev === 'value' ? 'percent' : 'value')} disabled={isPreviewing || category.isLocked} className="p-2 text-gray-400 bg-gray-700 rounded-lg hover:text-blue-400 transition"><RefreshCw size={18} /></button></div>
            <div className="mt-3 text-xs flex justify-between text-gray-400"><span>Gasto: {formatCurrency(actualExpenses)}</span><span className={isOverBudget ? 'text-red-400 font-bold' : 'text-green-400'}>{isOverBudget ? `Estourado: ${formatCurrency(Math.abs(remaining))}` : `Sobra: ${formatCurrency(remaining)}`}</span></div>
            <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2"><div className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : category.color}`} style={{ width: `${progressBarWidth}%` }}></div></div>
        </div>
    );
};

const PresetConfirmationBar = ({ onConfirm, onCancel }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm p-4 z-40 animate-fade-in"><div className="container mx-auto max-w-5xl flex justify-between items-center"><p className="text-white font-semibold">Gostou desta sugestão?</p><div className="flex gap-4"><button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-transform transform hover:scale-105 shadow-lg"><RefreshCw size={18} /> Cancelar</button><button onClick={onConfirm} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-transform transform hover:scale-105 shadow-lg"><Check size={20} /> Confirmar</button></div></div></div>
);

const BudgetAdjustmentBar = ({ totalPercentage, onAdjust }) => {
    const isOver = totalPercentage > 100;
    const difference = Math.abs(100 - totalPercentage);
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm p-4 z-40 animate-fade-in border-t-2 border-yellow-500 shadow-2xl"><div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-3"><div className="flex items-center gap-3 text-yellow-300"><AlertTriangle size={24} /><p className="font-semibold text-white">{isOver ? `Orçamento ${difference.toFixed(1)}% acima.` : `Faltam ${difference.toFixed(1)}%.`}</p></div><button onClick={onAdjust} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-transform transform hover:scale-105 shadow-lg"><RefreshCw size={18} /> Ajustar Orçamento</button></div></div>
    );
};

// Exporta tudo
window.BudgetComponents = {
    Modal, ConfirmationModal, PaymentAmountModal, PresetModal, EditGroupModal,
    CategoryForm, ExpenseForm, ExpenseList, CategoryItem, PresetConfirmationBar, BudgetAdjustmentBar,
    budgetPresets
};
