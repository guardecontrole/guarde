// Adaptação para rodar no navegador sem build system
const { useState, useEffect, useRef } = React;

// --- SISTEMA DE SEGURANÇA DE ÍCONES ---
// Isso impede que o site fique branco se a biblioteca de ícones falhar
const LucideLib = window.lucideReact || window.lucide || {};
const IconFallback = (props) => <span className="text-gray-500 text-xs" title="Ícone">⭕</span>;

// Função que tenta pegar o ícone, se não existir, devolve o Fallback
const getSafeIcon = (name) => {
    return LucideLib[name] ? LucideLib[name] : IconFallback;
};

// Extraindo ícones com segurança
const ChevronRight = getSafeIcon('ChevronRight');
const Folder = getSafeIcon('Folder');
const Plus = getSafeIcon('Plus');
const Edit = getSafeIcon('Edit');
const Trash2 = getSafeIcon('Trash2');
const ArrowLeft = getSafeIcon('ArrowLeft');
const DollarSign = getSafeIcon('DollarSign');
const Percent = getSafeIcon('Percent');
const X = getSafeIcon('X');
const AlertTriangle = getSafeIcon('AlertTriangle');
const BookOpen = getSafeIcon('BookOpen');
const Star = getSafeIcon('Star');
const Upload = getSafeIcon('Upload');
const Download = getSafeIcon('Download');
const Check = getSafeIcon('Check');
const RefreshCw = getSafeIcon('RefreshCw');
const Eye = getSafeIcon('Eye');
const Layers = getSafeIcon('Layers');
const ChevronDown = getSafeIcon('ChevronDown');
const Lock = getSafeIcon('Lock');
const Unlock = getSafeIcon('Unlock');
const MessageSquare = getSafeIcon('MessageSquare');
const CheckCircle = getSafeIcon('CheckCircle');
const Undo2 = getSafeIcon('Undo2');
const Redo2 = getSafeIcon('Redo2');
const Pause = getSafeIcon('Pause');
const Play = getSafeIcon('Play');
const Copy = getSafeIcon('Copy');
const MoreVertical = getSafeIcon('MoreVertical');

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

// Modelos de orçamento pré-definidos para facilitar o início do usuário.
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

// Hook personalizado para gerir o estado com histórico (desfazer/refazer).
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
        if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
            return; // Não adiciona ao histórico se o estado for idêntico.
        }
        setState({
            past: [...state.past, state.present],
            present: newPresent,
            future: [], // Uma nova ação limpa o histórico de "refazer".
        });
    };
    
    // Função para definir o estado sem adicionar ao histórico (para importação).
    const setInitial = (newPresent) => {
        setState({
            past: [],
            present: newPresent,
            future: [],
        });
    }

    return { state: state.present, set, undo, redo, canUndo, canRedo, setInitial };
};


// Helper para formatar valores numéricos como moeda (BRL).
const formatCurrency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
      value = 0;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Componente de Modal genérico e reutilizável.
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

// Componente de Modal para confirmações de ações destrutivas (ex: exclusão).
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

// Componente de Modal para registrar o valor pago em despesas do tipo "Fixo (Valor Variável)".
const PaymentAmountModal = ({ isOpen, onClose, onSubmit, expense }) => {
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (isOpen && expense) {
            // Sugere o valor da última parcela para facilitar a digitação.
            setAmount(String(expense.installmentValue || '').replace('.', ','));
        }
    }, [isOpen, expense]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(String(amount).replace(',', '.'));
        if (!isNaN(parsedAmount) && parsedAmount >= 0) {
            onSubmit(parsedAmount);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 text-white">
                <h3 className="text-xl font-bold">Registrar Pagamento</h3>
                <p>Qual foi o valor pago para a despesa <span className="font-bold">{expense?.description}</span>?</p>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Valor Pago (R$)</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                        autoFocus
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Confirmar Pagamento</button>
                </div>
            </form>
        </Modal>
    );
};

// Componente de Modal para seleção de modelos de orçamento pré-definidos.
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

// Componente de Modal para editar o nome de um grupo.
const EditGroupModal = ({ isOpen, onClose, onSubmit, groupName }) => {
    const [newGroupName, setNewGroupName] = useState(groupName || '');

    useEffect(() => {
        if (isOpen) {
            setNewGroupName(groupName);
        }
    }, [isOpen, groupName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newGroupName.trim() && newGroupName.trim() !== groupName) {
            onSubmit(groupName, newGroupName.trim());
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6 text-white">
                <h3 className="text-xl font-bold">Editar Nome do Grupo</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Novo nome para "{groupName}"</label>
                    <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                        autoFocus
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Salvar Alterações</button>
                </div>
            </form>
        </Modal>
    );
};

// Componente de formulário para criar ou editar uma categoria.
const CategoryForm = ({ onSubmit, onCancel, categoryData, existingGroups = [] }) => {
    const [name, setName] = useState(categoryData?.name || '');
    const [group, setGroup] = useState(categoryData?.group || '');
    const [color, setColor] = useState(categoryData?.color || availableColors[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...categoryData, name, group, color });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">{categoryData?.id ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Categoria</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Grupo (Opcional)</label>
                <input
                    type="text"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder="Digite ou selecione um grupo existente"
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    list="group-suggestions"
                />
                <datalist id="group-suggestions">
                    {existingGroups.map(g => (
                        <option key={g} value={g} />
                    ))}
                </datalist>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cor</label>
                <div className="flex flex-wrap gap-3">
                    {availableColors.map(c => (
                        <div key={c} onClick={() => setColor(c)} className={`w-10 h-10 rounded-full cursor-pointer ${c} transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}></div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Salvar</button>
            </div>
        </form>
    );
};


// Componente de formulário para criar ou editar uma despesa.
const ExpenseForm = ({ onSubmit, onCancel, expenseData }) => {
    const [description, setDescription] = useState(expenseData?.description || '');
    const [totalValue, setTotalValue] = useState(expenseData?.totalValue || '');
    const [installments, setInstallments] = useState(expenseData?.installments > 1 && expenseData?.installments < 9999 ? expenseData.installments : 1);
    const [status, setStatus] = useState(expenseData?.status || 'Andamento');
    const [startDate, setStartDate] = useState(expenseData?.startDate || new Date().toISOString().split('T')[0]);
    const [observation, setObservation] = useState(expenseData?.observation || '');
    const [finalInstallmentDate, setFinalInstallmentDate] = useState(null);

    // Efeito para calcular a data da última parcela em tempo real no formulário.
    useEffect(() => {
        if (status === 'Andamento' && startDate && installments > 1) {
            const parsedInstallments = parseInt(installments, 10);
            if (!isNaN(parsedInstallments) && parsedInstallments > 1) {
                const start = new Date(startDate);
                // Adiciona 1 dia à data de início para evitar problemas de fuso horário/virada de mês.
                const final = new Date(start.getFullYear(), start.getMonth() + parsedInstallments - 1, start.getDate() + 1);
                setFinalInstallmentDate(final);
            } else {
                setFinalInstallmentDate(null);
            }
        } else {
            setFinalInstallmentDate(null);
        }
    }, [startDate, installments, status]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedValue = parseFloat(String(totalValue).replace(',', '.')) || 0;
        
        let expensePayload = {
            id: expenseData?.id || Date.now(),
            description,
            status,
            startDate,
            observation,
            paidInstallments: expenseData?.paidInstallments || 0,
            isPaused: expenseData?.isPaused || false, // Garante que a propriedade exista
        };

        if (status === 'Andamento') {
            const parsedInstallments = parseInt(installments, 10) || 1;
            expensePayload = {
                ...expensePayload,
                totalValue: parsedValue,
                installments: parsedInstallments,
                installmentValue: parsedInstallments > 0 ? parsedValue / parsedInstallments : parsedValue,
            };
        } else if (status === 'Fixa-Variável') {
            expensePayload = {
                ...expensePayload,
                totalValue: parsedValue, // Armazena o valor inicial como referência
                installments: 9999, // Define como "infinito"
                installmentValue: parsedValue, // Valor do primeiro pagamento
                paymentHistory: expenseData?.paymentHistory || [],
            };
        } else { // Fixo ou Variável
            expensePayload = {
                ...expensePayload,
                totalValue: parsedValue,
                installments: status === 'Fixo' ? 9999 : 1, // "Infinito" para Fixo, 1 para Variável
                installmentValue: parsedValue,
            };
        }
        
        onSubmit(expensePayload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">{expenseData ? 'Editar Despesa' : 'Adicionar Despesa'}</h3>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                    {status === 'Andamento' ? 'Valor Total da Compra' : 'Valor da Despesa (ou 1º Pagamento)'}
                </label>
                <input type="text" inputMode="decimal" value={String(totalValue).replace('.', ',')} onChange={(e) => setTotalValue(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
            </div>
            <div className={`grid ${status === 'Andamento' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {status === 'Andamento' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nº de Parcelas</label>
                        <input type="number" value={installments} onChange={(e) => setInstallments(e.target.value)} min="1" className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                        {finalInstallmentDate && (
                            <p className="text-xs text-gray-400 mt-2">
                                Última parcela em: {finalInstallmentDate.toLocaleDateString('pt-BR')}
                            </p>
                        )}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{status === 'Andamento' ? 'Data da 1ª Parcela' : 'Data do Vencimento'}</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Despesa</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                    <option value="Andamento">Andamento (Parcelado)</option>
                    <option value="Fixo">Fixo (Valor Fixo)</option>
                    <option value="Fixa-Variável">Fixo (Valor Variável)</option>
                    <option value="Variável">Variável (Pagamento Único)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Observação (Opcional)</label>
                <textarea 
                    value={observation} 
                    onChange={(e) => setObservation(e.target.value)} 
                    rows="3" 
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                ></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-semibold transition">Salvar</button>
            </div>
        </form>
    );
};

// Componente para exibir a lista de despesas de uma categoria selecionada.
const ExpenseList = ({ category, onBack, onUpdateExpense, onDeleteExpense, onAddExpense, onMarkAsPaid, onUndoPayment, onOpenPaymentModal, onTogglePause, onDuplicateExpense }) => {
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedExpenseForAction, setSelectedExpenseForAction] = useState(null);

    const openActionsModal = (expense) => {
        setSelectedExpenseForAction(expense);
        setIsActionModalOpen(true);
    };

    const closeActionsModal = () => {
        setIsActionModalOpen(false);
        setSelectedExpenseForAction(null);
    };

    const handleAddClick = () => {
        setEditingExpense(null);
        setExpenseModalOpen(true);
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setExpenseModalOpen(true);
        closeActionsModal();
    };

    const handleDeleteRequest = (expenseId) => {
        setExpenseToDelete(expenseId);
        setConfirmationModalOpen(true);
        closeActionsModal();
    };

    const confirmDelete = () => {
        onDeleteExpense(category.id, expenseToDelete);
        setConfirmationModalOpen(false);
        setExpenseToDelete(null);
    };

    const handleFormSubmit = (expenseData) => {
        if (editingExpense) {
            onUpdateExpense(category.id, expenseData);
        } else {
            onAddExpense(category.id, expenseData);
        }
        setExpenseModalOpen(false);
        setEditingExpense(null);
    };

    // Calcula os totais da categoria para exibição no cabeçalho, ignorando despesas pausadas.
    const totalCategoryValue = category.expenses
        .filter(exp => !exp.isPaused)
        .reduce((sum, exp) => sum + exp.installmentValue, 0);
    const budgetedValue = category.budgetedValue || 0;
    const availableValue = budgetedValue - totalCategoryValue;

    return (
        <div className="bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 rounded-2xl animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700 transition mr-4">
                        <ArrowLeft size={24} />
                    </button>
                    <div className={`w-4 h-8 rounded mr-3 ${category.color}`}></div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white flex-grow">{category.name}</h2>
                </div>
                <div className="flex-shrink-0 grid grid-cols-3 gap-4 sm:gap-6 text-right w-full sm:w-auto">
                    <div>
                        <p className="text-gray-400 text-sm">Orçado</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(budgetedValue)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Gasto</p>
                        <p className="text-xl font-bold text-red-400">{formatCurrency(totalCategoryValue)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Disponível</p>
                        <p className={`text-xl font-bold ${availableValue >= 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {formatCurrency(availableValue)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-transform transform hover:scale-105 shadow-lg">
                    <Plus size={20} />
                    Adicionar Despesa
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="border-b-2 border-gray-700">
                        <tr className="text-sm text-gray-400">
                            <th className="p-3">Descrição</th>
                            <th className="p-3 text-right">Valor Mensal</th>
                            <th className="p-3 text-center">Progresso</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.expenses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">Nenhuma despesa adicionada.</td>
                            </tr>
                        ) : category.expenses.map(expense => {
                            const isPaused = expense.isPaused;
                            const paidInstallments = expense.paidInstallments || 0;
                            const isComplete = paidInstallments >= expense.installments;

                            let dueDate = null;
                            let isOverdue = false;

                            // Calcula a próxima data de vencimento e se está atrasada.
                            if (expense.startDate) {
                                const startDate = new Date(expense.startDate);
                                // Adiciona meses pagos à data de início para obter o vencimento da próxima parcela.
                                // O +1 no dia é para evitar problemas de fuso horário.
                                dueDate = new Date(startDate.getFullYear(), startDate.getMonth() + paidInstallments, startDate.getDate() + 1);
                                
                                const today = new Date();
                                today.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data.
                                
                                if (today > dueDate && !isComplete && !isPaused) {
                                    isOverdue = true;
                                }
                            }

                            const remainingInstallments = expense.installments - paidInstallments;
                            const remainingValue = remainingInstallments * expense.installmentValue;
                            const displayStatus = isPaused ? 'Pausado' : isComplete ? 'Pago' : (isOverdue ? 'Atrasado' : expense.status);

                            return (
                                <tr key={expense.id} className={`border-b border-gray-800 transition-colors ${isPaused ? 'bg-gray-800/60' : 'hover:bg-gray-800/50'} ${isOverdue && !isPaused ? 'bg-red-900/30' : ''}`}>
                                    <td className={`p-3 font-medium text-white transition-opacity ${isPaused ? 'opacity-60' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <span>{expense.description}</span>
                                            {expense.observation && (
                                                <div className="relative group flex-shrink-0">
                                                    <MessageSquare size={14} className="text-gray-500 cursor-pointer" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 border border-gray-700 text-white text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                                        <p className="font-semibold mb-1">Observação:</p>
                                                        <p className="whitespace-pre-wrap">{expense.observation}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {isOverdue && dueDate && <div className="text-xs text-red-400 font-semibold mt-1">Vencido em: {dueDate.toLocaleDateString('pt-BR')}</div>}
                                    </td>
                                    <td className={`p-3 text-right font-semibold text-blue-400 transition-opacity ${isPaused ? 'opacity-60' : ''}`}>{formatCurrency(expense.installmentValue)}</td>
                                    <td className={`p-3 text-center text-gray-300 transition-opacity ${isPaused ? 'opacity-60' : ''}`}>
                                        {(() => {
                                            if (expense.status === 'Variável') {
                                                return <span>Pag. Única</span>;
                                            }
                                            if (expense.status === 'Fixo') {
                                                if (isComplete) return <span>Pago</span>;
                                                return dueDate ? <span className="text-xs">Próx. Venc: {dueDate.toLocaleDateString('pt-BR')}</span> : <span className="text-xs text-gray-500">Sem data</span>;
                                            }
                                            if (expense.status === 'Fixa-Variável') {
                                                const hasHistory = expense.paymentHistory && expense.paymentHistory.length > 0;
                                                const average = hasHistory
                                                    ? expense.paymentHistory.reduce((sum, p) => sum + p.amount, 0) / expense.paymentHistory.length
                                                    : 0;
                                                return (
                                                    <div>
                                                        {dueDate && <span className="text-xs">Próx. Venc: {dueDate.toLocaleDateString('pt-BR')}</span>}
                                                        {hasHistory && (
                                                            <div className="text-xs text-gray-500" title="Valor médio pago">
                                                                Média: {formatCurrency(average)}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            // Default para 'Andamento' (parcelado)
                                            return (
                                                <div>
                                                    <span className="font-mono">{paidInstallments} / {expense.installments}</span>
                                                    <div className="text-xs text-gray-500" title="Valor restante">
                                                        Falta: {formatCurrency(remainingValue)}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className={`p-3 text-center transition-opacity ${isPaused ? 'opacity-60' : ''}`}>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            displayStatus === 'Pausado' ? 'bg-gray-600/50 text-gray-400' :
                                            displayStatus === 'Pago' ? 'bg-green-500/20 text-green-400' :
                                            displayStatus === 'Atrasado' ? 'bg-red-500/20 text-red-400' :
                                            displayStatus === 'Andamento' ? 'bg-yellow-500/20 text-yellow-400' :
                                            displayStatus === 'Fixa-Variável' ? 'bg-indigo-500/20 text-indigo-400' :
                                            displayStatus === 'Fixo' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-300'
                                        }`}>
                                            {displayStatus}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center">
                                            <div className={`transition-opacity ${isPaused ? 'opacity-60' : ''}`}>
                                                {!isComplete && (
                                                    <button 
                                                        onClick={() => {
                                                            if (expense.status === 'Fixa-Variável') {
                                                                onOpenPaymentModal(expense);
                                                            } else {
                                                                onMarkAsPaid(category.id, expense.id);
                                                            }
                                                        }}
                                                        disabled={isPaused}
                                                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-md transition disabled:cursor-not-allowed disabled:text-gray-600"
                                                        title="Marcar esta parcela como paga"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => openActionsModal(expense)}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)}>
                <ExpenseForm onSubmit={handleFormSubmit} onCancel={() => setExpenseModalOpen(false)} expenseData={editingExpense} />
            </Modal>
            <ConfirmationModal 
                isOpen={isConfirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Despesa"
                message="Tem certeza que deseja excluir esta despesa?"
            />
            <Modal isOpen={isActionModalOpen} onClose={closeActionsModal} maxWidth="max-w-sm">
                {selectedExpenseForAction && (
                    <div className="text-white">
                        <h3 className="text-lg font-bold mb-4 text-center">Ações para "{selectedExpenseForAction.description}"</h3>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleEditClick(selectedExpenseForAction)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition"><Edit size={16} /> Editar Despesa</button>
                            <button onClick={() => { onDuplicateExpense(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition"><Copy size={16} /> Duplicar</button>
                            <button onClick={() => { onTogglePause(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition">
                                {selectedExpenseForAction.isPaused ? <Play size={16} /> : <Pause size={16} />}
                                {selectedExpenseForAction.isPaused ? 'Reativar Despesa' : 'Pausar Despesa'}
                            </button>
                            {(selectedExpenseForAction.paidInstallments || 0) > 0 && (
                                <button onClick={() => { onUndoPayment(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-yellow-400 hover:bg-yellow-500/20 rounded-md transition"><Undo2 size={16} /> Desfazer Pagamento</button>
                            )}
                            <div className="w-full h-px bg-gray-600 my-1"></div>
                            <button onClick={() => handleDeleteRequest(selectedExpenseForAction.id)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-md transition"><Trash2 size={16} /> Excluir Despesa</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
// Componente para um item de categoria na lista principal.
const CategoryItem = ({ category, income, onUpdateBudget, onSelectCategory, onEdit, onDelete, isPreviewing, onToggleLock, dragProps }) => {
    const [inputValue, setInputValue] = useState('0,00');
    const [inputPercent, setInputPercent] = useState('0,0');
    const [editMode, setEditMode] = useState('value'); // 'value' ou 'percent'

    // Efeito para sincronizar o estado local dos inputs com as props que vêm de fora.
    // Isso é importante para quando o orçamento é ajustado automaticamente.
    useEffect(() => {
        const newBudgetValue = category.budgetedValue || 0;
        const newPercentage = income > 0 ? (newBudgetValue / income) * 100 : 0;
        setInputValue(newBudgetValue.toFixed(2).replace('.', ','));
        setInputPercent(newPercentage.toFixed(1).replace('.', ','));
    }, [category.budgetedValue, income]);

    const handleValueChange = (e) => {
        setInputValue(e.target.value);
    };

    const handlePercentageChange = (e) => {
        setInputPercent(e.target.value);
    };

    // Atualiza o orçamento no estado global quando o usuário termina de editar o campo.
    const handleBlur = (source) => {
        if (category.isLocked) return;
        if (source === 'value') {
            onUpdateBudget(category.id, inputValue, 'value');
        } else {
            onUpdateBudget(category.id, inputPercent, 'percent');
        }
    };

    const actualExpenses = category.expenses
        .filter(exp => !exp.isPaused)
        .reduce((sum, exp) => sum + exp.installmentValue, 0);
    const remaining = (category.budgetedValue || 0) - actualExpenses;
    const isOverBudget = remaining < 0;
    const progressBarWidth = (category.budgetedValue || 0) > 0 ? Math.min((actualExpenses / (category.budgetedValue || 0)) * 100, 100) : 0;

    const isBeingDragged = dragProps.draggedItem?.id === category.id;
    const isDragTarget = dragProps.dragOverItem?.id === category.id;
    const dragItemType = dragProps.draggedItem?.type;

    return (
        <div 
            draggable={!isPreviewing}
            onDragStart={() => dragProps.onDragStart({ id: category.id, type: 'category', group: category.group || null })}
            onDragEnd={() => dragProps.onDragEnd()}
            onDrop={(e) => { e.preventDefault(); dragProps.onDrop({ id: category.id, type: 'category', group: category.group || null }); }}
            onDragOver={(e) => { e.preventDefault(); dragProps.onDragEnter({ id: category.id, type: 'category', group: category.group || null }); }}
            onDragLeave={(e) => { e.preventDefault(); dragProps.onDragLeave(); }}
            className={`bg-gray-700/50 rounded-xl transition-all group relative p-4 ${!isPreviewing ? 'cursor-grab' : ''} ${isPreviewing ? 'opacity-70' : ''} ${category.isLocked ? 'border-2 border-yellow-500/50' : 'border-2 border-transparent'} ${isBeingDragged ? 'opacity-50' : 'opacity-100'}`}
        >
            {isDragTarget && !isBeingDragged && dragItemType === 'category' && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full animate-pulse"></div>}
            
            <div className="flex items-center justify-between">
                <div onClick={() => !isPreviewing && onSelectCategory(category)} className={`flex items-center flex-grow mr-4 min-w-0 ${!isPreviewing ? 'cursor-pointer' : 'cursor-default'}`}>
                    <div className={`w-3 h-6 rounded-sm mr-4 flex-shrink-0 ${category.color}`}></div>
                    <Folder size={20} className="text-gray-400 mr-3 hidden sm:block flex-shrink-0" />
                    <span className="font-semibold text-white truncate">{category.name}</span>
                </div>
                <div className="flex items-center flex-shrink-0">
                    <button onClick={() => !isPreviewing && onToggleLock(category.id)} disabled={isPreviewing} className={`p-2 text-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed ${category.isLocked ? 'text-yellow-400 hover:text-yellow-300' : 'hover:text-white'}`}>
                        {category.isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                    </button>
                    <button onClick={() => !isPreviewing && onEdit(category)} disabled={isPreviewing || category.isLocked} className="p-2 text-gray-400 hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"><Edit size={18} /></button>
                    <button onClick={() => !isPreviewing && onDelete(category.id)} disabled={isPreviewing} className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"><Trash2 size={18} /></button>
                    {!isPreviewing && <ChevronRight size={20} className="text-gray-500 ml-2 group-hover:text-white transition" onClick={() => onSelectCategory(category)} />}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
                {editMode === 'value' ? (
                    <>
                        {/* Editar Valor, Visualizar Porcentagem */}
                        <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                type="text" inputMode="decimal" value={inputValue}
                                onBlur={() => handleBlur('value')}
                                onChange={handleValueChange}
                                disabled={isPreviewing || category.isLocked}
                                className="w-full bg-gray-700 text-white rounded-lg p-2 pl-9 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800"
                            />
                        </div>
                        <div className="flex-shrink-0 bg-gray-800/60 text-gray-300 font-semibold text-base rounded-lg px-4 py-[9px]" title="Porcentagem da receita total">
                            <span>{inputPercent}%</span>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Editar Porcentagem, Visualizar Valor */}
                         <div className="relative flex-grow">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                            <input
                                type="text" inputMode="decimal" value={inputPercent}
                                onBlur={() => handleBlur('percent')}
                                onChange={handlePercentageChange}
                                disabled={isPreviewing || category.isLocked}
                                className="w-full bg-gray-700 text-white rounded-lg p-2 pr-8 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800"
                            />
                        </div>
                        <div className="flex-shrink-0 bg-gray-800/60 text-gray-300 font-semibold text-base rounded-lg px-4 py-[9px]" title="Valor orçado em Reais">
                            <span>{formatCurrency(parseFloat(inputValue.replace(',', '.')))}</span>
                        </div>
                    </>
                )}
                <button 
                    onClick={() => setEditMode(prev => prev === 'value' ? 'percent' : 'value')}
                    disabled={isPreviewing || category.isLocked}
                    className="p-2 text-gray-400 bg-gray-700 rounded-lg hover:bg-gray-600 hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Alternar modo de edição (Valor ou Porcentagem)"
                >
                    <RefreshCw size={18} />
                </button>
            </div>
            
            <div className="mt-3 text-xs flex justify-between text-gray-400">
                <span>Gasto: {formatCurrency(actualExpenses)}</span>
                <span className={isOverBudget ? 'text-red-400 font-bold' : 'text-green-400'}>
                    {isOverBudget ? `Estourado: ${formatCurrency(Math.abs(remaining))}` : `Sobra: ${formatCurrency(remaining)}`}
                </span>
            </div>

            <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                <div 
                    className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : category.color}`} 
                    style={{ width: `${progressBarWidth}%` }}
                ></div>
            </div>
            {isDragTarget && !isBeingDragged && dragItemType === 'category' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full animate-pulse"></div>}
        </div>
    );
};

// Barra de confirmação para usar um modelo de orçamento.
const PresetConfirmationBar = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm p-4 z-40 animate-fade-in">
            <div className="container mx-auto max-w-5xl flex justify-between items-center">
                <p className="text-white font-semibold">Gostou desta sugestão de orçamento?</p>
                <div className="flex gap-4">
                    <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-transform transform hover:scale-105 shadow-lg">
                        <RefreshCw size={18} />
                        Cancelar / Escolher Outra
                    </button>
                    <button onClick={onConfirm} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-transform transform hover:scale-105 shadow-lg">
                        <Check size={20} />
                        Confirmar Sugestão
                    </button>
                </div>
            </div>
        </div>
    );
};

// Barra de aviso e ajuste de orçamento quando a soma das porcentagens não é 100%.
const BudgetAdjustmentBar = ({ totalPercentage, onAdjust }) => {
    const isOver = totalPercentage > 100;
    const difference = Math.abs(100 - totalPercentage);
    const message = isOver 
        ? `Orçamento ${difference.toFixed(1)}% acima do total.`
        : `Faltam ${difference.toFixed(1)}% para completar o orçamento.`;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm p-4 z-40 animate-fade-in border-t-2 border-yellow-500 shadow-2xl">
            <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3 text-yellow-300">
                    <AlertTriangle size={24} />
                    <p className="font-semibold text-white">{message}</p>
                </div>
                <button onClick={onAdjust} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-transform transform hover:scale-105 shadow-lg">
                    <RefreshCw size={18} />
                    Ajustar Orçamento
                </button>
            </div>
        </div>
    );
};

// Componente da lista de categorias, a tela principal da aplicação.
const CategoryList = ({ categories, income, onSelectCategory, onUpdateIncome, onUpdateCategoryBudget, onOpenCategoryModal, onDeleteCategoryRequest, onDeleteGroupRequest, onOpenPresetModal, onExport, onImport, tempPresetCategories, onConfirmPreset, onCancelPreset, onToggleLock, onMoveItem, onOpenEditGroupModal, undo, redo, canUndo, canRedo }) => {
    const isPreviewing = tempPresetCategories !== null;
    const displayCategories = isPreviewing ? tempPresetCategories : categories;
    
    const totalExpenses = displayCategories.reduce((total, category) => {
        return total + (category.expenses || [])
            .filter(exp => !exp.isPaused)
            .reduce((sum, exp) => sum + exp.installmentValue, 0);
    }, 0);
    const balance = income - totalExpenses;
    const isIncomeSet = income > 0;

    const [newIncome, setNewIncome] = useState(String(income));
    const [isEditingIncome, setIsEditingIncome] = useState(false);
    const incomeInputRef = useRef(null);
    const [collapsedGroups, setCollapsedGroups] = useState({});
    
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    const dragProps = {
        draggedItem,
        dragOverItem,
        onDragStart: (item) => setDraggedItem(item),
        onDrop: (targetItem) => {
            if (draggedItem) {
                onMoveItem(draggedItem, targetItem);
            }
            setDraggedItem(null);
            setDragOverItem(null);
        },
        onDragEnter: (item) => {
            if (draggedItem && draggedItem.id !== item.id) {
                setDragOverItem(item);
            }
        },
        onDragLeave: () => setDragOverItem(null),
        onDragEnd: () => {
            setDraggedItem(null);
            setDragOverItem(null);
        }
    };

    const toggleGroupCollapse = (groupName) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    useEffect(() => {
        setNewIncome(String(income).replace('.', ','));
    }, [income]);

    useEffect(() => {
        if (isEditingIncome) {
            incomeInputRef.current?.focus();
            incomeInputRef.current?.select();
        }
    }, [isEditingIncome]);

    const handleIncomeBlur = () => {
        const value = parseFloat(String(newIncome).replace(',', '.'));
        if(!isNaN(value) && value >= 0) {
            onUpdateIncome(value);
        } else {
            setNewIncome(String(income).replace('.', ','));
        }
        setIsEditingIncome(false);
    };

    const handleIncomeKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleIncomeBlur();
        } else if (e.key === 'Escape') {
            setNewIncome(String(income).replace('.', ','));
            setIsEditingIncome(false);
        }
    };

    // Lógica para agrupar categorias.
    const categoriesWithGroup = displayCategories.filter(c => c.group && c.group.trim() !== '');
    const categoriesWithoutGroup = displayCategories.filter(c => !c.group || c.group.trim() === '');

    const groupedCategories = categoriesWithGroup.reduce((acc, category) => {
        const groupName = category.group.trim();
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(category);
        return acc;
    }, {});

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-all ${!isIncomeSet && !isPreviewing ? 'animate-pulse-border' : 'border-2 border-transparent'}`}>
                    <div className="p-3 bg-green-500/20 rounded-xl"><DollarSign className="text-green-400" size={28}/></div>
                    <div>
                        <p className="text-gray-400 text-sm">Sua Receita</p>
                        {isEditingIncome ? (
                             <input ref={incomeInputRef} type="text" inputMode="decimal" value={newIncome} onChange={(e) => setNewIncome(e.target.value)} onBlur={handleIncomeBlur} onKeyDown={handleIncomeKeyDown} className="text-2xl font-bold text-white bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md px-1 -mx-1"/>
                        ) : (
                            <div onClick={() => !isPreviewing && setIsEditingIncome(true)} className={`text-2xl font-bold text-white flex items-center group ${!isPreviewing ? 'cursor-pointer' : 'cursor-default'}`}>
                                <span>{formatCurrency(income)}</span>
                                {!isPreviewing && <Edit size={16} className="ml-2 text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />}
                            </div>
                        )}
                    </div>
                </div>
                 <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                    <div className="p-3 bg-red-500/20 rounded-xl"><DollarSign className="text-red-400" size={28}/></div>
                    <div>
                        <p className="text-gray-400 text-sm">Total de Despesas</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
                    </div>
                </div>
                 <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${balance >= 0 ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}><DollarSign className={`${balance >= 0 ? 'text-blue-400' : 'text-yellow-400'}`} size={28}/></div>
                    <div>
                        <p className="text-gray-400 text-sm">Saldo Restante</p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-yellow-400'}`}>{formatCurrency(balance)}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-white">Orçamento por Categoria</h2>
                    <div className="flex items-center gap-3 flex-wrap">
                         <button onClick={undo} disabled={!canUndo || isPreviewing} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"><Undo2 size={20} />Desfazer</button>
                         <button onClick={redo} disabled={!canRedo || isPreviewing} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"><Redo2 size={20} />Refazer</button>
                         <button onClick={onImport} disabled={isPreviewing} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"><Upload size={20} />Importar</button>
                         <button onClick={onExport} disabled={isPreviewing} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"><Download size={20} />Exportar</button>
                        <button onClick={() => isIncomeSet && onOpenCategoryModal()} disabled={!isIncomeSet || isPreviewing} title={!isIncomeSet ? "Adicione sua receita primeiro." : isPreviewing ? "Confirme ou cancele a sugestão atual." : "Nova Categoria"} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all transform shadow-lg ${isIncomeSet && !isPreviewing ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105' : 'bg-gray-600 opacity-50 cursor-not-allowed'}`}><Plus size={20} />Nova</button>
                    </div>
                </div>
                
                {isPreviewing && (
                    <div className="bg-blue-900/50 border-2 border-dashed border-blue-700 text-blue-200 px-4 py-3 rounded-xl mb-6 text-center animate-fade-in flex items-center justify-center gap-3">
                        <Eye size={20} /><p className="font-bold">Veja essa sugestão de orçamento.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {Object.keys(groupedCategories).length === 0 && categoriesWithoutGroup.length === 0 ? (
                        <div className="text-center py-10 px-4 border-2 border-dashed border-gray-700 rounded-xl">
                            <Folder size={40} className="mx-auto text-gray-500" />
                            <p className="mt-4 text-gray-300 font-semibold">Seu orçamento está vazio.</p>
                            <p className="text-sm text-gray-400 mt-2">Comece definindo sua receita e depois crie categorias ou use um modelo.</p>
                             <button onClick={() => isIncomeSet && onOpenPresetModal()} disabled={!isIncomeSet || isPreviewing} title={!isIncomeSet ? "Adicione sua receita primeiro." : isPreviewing ? "Confirme ou cancele a sugestão atual." : "Usar Modelo"} className={`mt-6 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg text-white transition-all transform shadow-lg ${isIncomeSet && !isPreviewing ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105' : 'bg-gray-600 opacity-50 cursor-not-allowed'}`}><Star size={20} />Usar Modelo de Orçamento</button>
                        </div>
                    ) : (
                        <>
                            {Object.entries(groupedCategories).map(([groupName, categoriesInGroup]) => {
                                const groupBudgetedValue = categoriesInGroup.reduce((sum, cat) => sum + (cat.budgetedValue || 0), 0);
                                const groupExpenses = categoriesInGroup.reduce((sum, cat) => sum + (cat.expenses || [])
                                    .filter(exp => !exp.isPaused)
                                    .reduce((expSum, exp) => expSum + exp.installmentValue, 0), 0);
                                const groupPercentage = income > 0 ? (groupBudgetedValue / income) * 100 : 0;
                                const isCollapsed = collapsedGroups[groupName];

                                const isGroupBeingDragged = dragProps.draggedItem?.id === groupName;
                                const isGroupDragTarget = dragProps.dragOverItem?.id === groupName;
                                const dragItemType = dragProps.draggedItem?.type;

                                return (
                                    <div key={groupName} className="relative">
                                        {isGroupDragTarget && !isGroupBeingDragged && dragItemType === 'group' && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-full animate-pulse"></div>}
                                        <div 
                                            draggable={!isPreviewing}
                                            onDragStart={() => dragProps.onDragStart({ id: groupName, type: 'group' })}
                                            onDragEnd={() => dragProps.onDragEnd()}
                                            onDrop={(e) => { e.preventDefault(); dragProps.onDrop({ id: groupName, type: 'group' }); }}
                                            onDragOver={(e) => { e.preventDefault(); dragProps.onDragEnter({ id: groupName, type: 'group' }); }}
                                            onDragLeave={(e) => { e.preventDefault(); dragProps.onDragLeave(); }}
                                            className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 p-3 bg-gray-800/50 rounded-lg gap-2 text-left hover:bg-gray-700/70 transition-colors ${!isPreviewing ? 'cursor-grab' : ''} ${isGroupBeingDragged ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex items-center flex-grow cursor-pointer" onClick={() => toggleGroupCollapse(groupName)}>
                                                <Layers size={18} className="text-gray-400 mr-3" /><h3 className="text-lg font-semibold text-white uppercase tracking-wider">{groupName}</h3>
                                                <ChevronDown size={20} className={`ml-3 text-gray-500 transition-transform transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-end">
                                                <div><span className="text-gray-400">Gasto: </span><span className="font-semibold text-white">{formatCurrency(groupExpenses)}</span></div>
                                                <div className="text-right"><span className="font-bold text-white">{formatCurrency(groupBudgetedValue)}</span><span className="ml-2 text-gray-400 font-mono">({groupPercentage.toFixed(1)}%)</span></div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onOpenEditGroupModal(groupName); }}
                                                    disabled={isPreviewing}
                                                    className="p-1 text-gray-500 hover:text-blue-400 transition disabled:opacity-50"
                                                    title={`Editar o nome do grupo "${groupName}"`}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteGroupRequest(groupName); }}
                                                    disabled={isPreviewing}
                                                    className="p-1 text-gray-500 hover:text-red-400 transition disabled:opacity-50"
                                                    title={`Excluir o grupo "${groupName}"`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        {!isCollapsed && (
                                            <div className="space-y-4 pl-4 border-l-2 border-gray-700/50 ml-3 animate-fade-in-down">
                                                {categoriesInGroup.map(category => (
                                                    <CategoryItem key={category.id} category={category} income={income} onUpdateBudget={onUpdateCategoryBudget} onSelectCategory={onSelectCategory} onEdit={onOpenCategoryModal} onDelete={onDeleteCategoryRequest} isPreviewing={isPreviewing} onToggleLock={onToggleLock} dragProps={dragProps}/>
                                                ))}
                                            </div>
                                        )}
                                        {isGroupDragTarget && !isGroupBeingDragged && dragItemType === 'group' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full animate-pulse"></div>}
                                    </div>
                                );
                            })}
                            {categoriesWithoutGroup.length > 0 && (
                                <div className="space-y-4 pt-6">
                                    {categoriesWithoutGroup.map(category => (
                                        <CategoryItem key={category.id} category={category} income={income} onUpdateBudget={onUpdateCategoryBudget} onSelectCategory={onSelectCategory} onEdit={onOpenCategoryModal} onDelete={onDeleteCategoryRequest} isPreviewing={isPreviewing} onToggleLock={onToggleLock} dragProps={dragProps}/>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {isPreviewing && <PresetConfirmationBar onConfirm={onConfirmPreset} onCancel={onCancelPreset} />}
        </div>
    );
};

// Componente Principal da Aplicação. Gerencia todo o estado e a lógica de negócios.
const OrcamentoPage = () => {
    // Estado principal que armazena todos os dados do usuário, com histórico.
    const { 
        state: data, 
        set: setData, 
        undo, 
        redo, 
        canUndo, 
        canRedo,
        setInitial: setInitialData
    } = useHistoryState(initialData);

    // Estado para controlar qual categoria está selecionada para visualização de detalhes.
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Estados para controlar a visibilidade e os dados dos modais.
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

    // Deriva a lista de grupos existentes a partir dos dados das categorias.
    const existingGroups = [...new Set(data.categories.map(c => c.group).filter(g => g && g.trim() !== ''))];

    const handleOpenCategoryModal = (category = null) => {
        if (data.income <= 0 && !category) return;
        setEditingCategory(category);
        setIsCategoryModalOpen(true);
    };

    const handleCloseCategoryModal = () => {
        setEditingCategory(null);
        setIsCategoryModalOpen(false);
    };

    const handleSelectPreset = (preset) => {
        if (data.income <= 0) return;
        const newCategories = preset.categories.map(cat => ({
            id: Date.now() + Math.random(),
            name: cat.name,
            color: cat.color,
            group: cat.group || '',
            budgetedValue: (data.income * cat.percentage) / 100,
            expenses: [],
            isLocked: false,
        }));
        setTempPresetCategories(newCategories);
        setIsPresetModalOpen(false);
    };

    const handleConfirmPreset = () => {
        setData({ ...data, categories: tempPresetCategories });
        setTempPresetCategories(null);
    };

    const handleCancelPreset = () => {
        setTempPresetCategories(null);
        setIsPresetModalOpen(true);
    };

    const handleCategorySubmit = (categoryData) => {
        let newCategories;
        if (categoryData.id) {
            // Atualiza uma categoria existente.
            newCategories = data.categories.map(cat =>
                cat.id === categoryData.id ? { ...cat, ...categoryData } : cat
            );
        } else {
            // Adiciona uma nova categoria.
            const newCategory = {
                ...categoryData,
                id: Date.now(),
                budgetedValue: 0,
                expenses: [],
                isLocked: false,
            };
            newCategories = [...data.categories, newCategory];
        }
        setData({ ...data, categories: newCategories });
        handleCloseCategoryModal();
    };

    const handleDeleteCategoryRequest = (categoryId) => {
        setCategoryToDelete(categoryId);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteCategory = () => {
        if (categoryToDelete) {
            const newCategories = data.categories.filter(cat => cat.id !== categoryToDelete);
            setData({ ...data, categories: newCategories });
        }
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
    };

    const handleDeleteGroupRequest = (groupName) => {
        setGroupToDelete(groupName);
        setDeleteGroupConfirmOpen(true);
    };

    const confirmDeleteGroup = () => {
        if (groupToDelete) {
            const newCategories = data.categories.map(cat => {
                // Remove o grupo da categoria, mas não exclui a categoria.
                if (cat.group === groupToDelete) {
                    return { ...cat, group: '' };
                }
                return cat;
            });
            setData({ ...data, categories: newCategories });
        }
        setDeleteGroupConfirmOpen(false);
        setGroupToDelete(null);
    };

    const handleOpenEditGroupModal = (groupName) => {
        setEditingGroup(groupName);
        setEditGroupModalOpen(true);
    };

    const handleCloseEditGroupModal = () => {
        setEditingGroup(null);
        setEditGroupModalOpen(false);
    };

    const handleUpdateGroupName = (oldName, newName) => {
        const newCategories = data.categories.map(cat => {
            if (cat.group === oldName) {
                return { ...cat, group: newName };
            }
            return cat;
        });
        setData({ ...data, categories: newCategories });
        handleCloseEditGroupModal();
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
    };

    const handleUpdateIncome = (newIncome) => {
        const oldIncome = data.income;
        if (oldIncome === newIncome) return;

        const newCategories = data.categories.map(cat => {
            if (cat.isLocked || oldIncome <= 0) {
                return cat;
            }
            const percentage = (cat.budgetedValue || 0) / oldIncome;
            const newBudgetValue = newIncome * percentage;
            return { ...cat, budgetedValue: newBudgetValue };
        });
        setData({ income: newIncome, categories: newCategories });
    };
    
    const handleToggleCategoryLock = (categoryId) => {
        const updater = (categories) => categories.map(cat =>
            cat.id === categoryId ? { ...cat, isLocked: !cat.isLocked } : cat
        );
        if (tempPresetCategories) {
            setTempPresetCategories(updater);
        } else {
            const newCategories = updater(data.categories);
            setData({ ...data, categories: newCategories });
        }
    };

    const handleMoveItem = (draggedItem, targetItem) => {
        if (draggedItem.id === targetItem.id) return;

        const categories = tempPresetCategories ? tempPresetCategories : data.categories;
        
        let newCategories = Array.from(categories);

        if (draggedItem.type === 'category') {
            const draggedIndex = newCategories.findIndex(c => c.id === draggedItem.id);
            if (draggedIndex === -1) return;
            const [draggedCategory] = newCategories.splice(draggedIndex, 1);
            
            if (targetItem.type === 'category') {
                draggedCategory.group = targetItem.group;
                const targetIndex = newCategories.findIndex(c => c.id === targetItem.id);
                newCategories.splice(targetIndex, 0, draggedCategory);
            } else if (targetItem.type === 'group') {
                draggedCategory.group = targetItem.id;
                let targetIndex = newCategories.findIndex(c => c.group === targetItem.id);
                if (targetIndex !== -1) {
                    newCategories.splice(targetIndex, 0, draggedCategory);
                } else {
                    newCategories.push(draggedCategory);
                }
            }
        } else if (draggedItem.type === 'group' && targetItem.type === 'group') {
            const draggedGroupName = draggedItem.id;
            const targetGroupName = targetItem.id;
            const draggedGroupCategories = newCategories.filter(c => c.group === draggedGroupName);
            const otherCategories = newCategories.filter(c => c.group !== draggedGroupName);
            
            const targetIndex = otherCategories.findIndex(c => c.group === targetGroupName);
            if (targetIndex === -1) return;
            
            otherCategories.splice(targetIndex, 0, ...draggedGroupCategories);
            newCategories = otherCategories;
        }
        
        if (tempPresetCategories) {
            setTempPresetCategories(newCategories);
        } else {
            setData({ ...data, categories: newCategories });
        }
    };

    const handleUpdateCategoryBudget = (editedCategoryId, value, source) => {
        const targetCategories = tempPresetCategories || data.categories;

        const sanitizedValue = String(value).replace(',', '.');
        let newBudgetValue;

        if (source === 'percent') {
            newBudgetValue = data.income > 0 ? (data.income * parseFloat(sanitizedValue)) / 100 : 0;
        } else {
            newBudgetValue = parseFloat(sanitizedValue) || 0;
        }

        if (isNaN(newBudgetValue)) return;

        const newCategories = targetCategories.map(cat =>
            cat.id === editedCategoryId ? { ...cat, budgetedValue: Math.max(0, newBudgetValue) } : cat
        );

        if (tempPresetCategories) {
            setTempPresetCategories(newCategories);
        } else {
            setData({ ...data, categories: newCategories });
        }
    };

    // Ajusta automaticamente o orçamento das categorias não bloqueadas para que a soma total seja 100%.
    const handleAutoAdjustBudget = () => {
        const targetCategories = tempPresetCategories || data.categories;
        const unlockedCategories = targetCategories.filter(cat => !cat.isLocked);

        if (unlockedCategories.length === 0) return;

        const lockedBudget = targetCategories
            .filter(cat => cat.isLocked)
            .reduce((sum, cat) => sum + (cat.budgetedValue || 0), 0);
        
        if (lockedBudget > data.income) {
            console.error("Ajuste impossível: o valor das categorias bloqueadas excede a receita.");
            return;
        }

        const budgetToDistribute = data.income - lockedBudget;
        const totalBudgetOfUnlockable = unlockedCategories.reduce((sum, cat) => sum + (cat.budgetedValue || 0), 0);

        let adjustedCategories;
        if (totalBudgetOfUnlockable > 0) {
            adjustedCategories = targetCategories.map(cat => {
                if (cat.isLocked) return cat;
                const proportion = (cat.budgetedValue || 0) / totalBudgetOfUnlockable;
                return { ...cat, budgetedValue: Math.max(0, budgetToDistribute * proportion) };
            });
        } else {
            const adjustmentPerCategory = budgetToDistribute / unlockedCategories.length;
            adjustedCategories = targetCategories.map(cat => {
                if (cat.isLocked) return cat;
                return { ...cat, budgetedValue: Math.max(0, adjustmentPerCategory) };
            });
        }
        
        const finalTotal = adjustedCategories.reduce((sum, cat) => sum + (cat.budgetedValue || 0), 0);
        const roundingDifference = data.income - finalTotal;
        const firstUnlockableIndex = adjustedCategories.findIndex(c => !c.isLocked);
        if (firstUnlockableIndex !== -1 && Math.abs(roundingDifference) > 0.001) {
           adjustedCategories[firstUnlockableIndex].budgetedValue += roundingDifference;
        }

        if (tempPresetCategories) {
            setTempPresetCategories(adjustedCategories);
        } else {
            setData({ ...data, categories: adjustedCategories });
        }
    };

    // Agrupa todas as funções que modificam uma despesa e atualizam o estado.
    const updateCategoryAndSelection = (categoryId, expenseUpdater) => {
        const newCategories = data.categories.map(cat => {
            if (cat.id === categoryId) {
                return { ...cat, expenses: expenseUpdater(cat.expenses || []) };
            }
            return cat;
        });

        const updatedSelectedCategory = newCategories.find(cat => cat.id === categoryId);
        if (updatedSelectedCategory) {
            setSelectedCategory(updatedSelectedCategory);
        }
        
        setData({ ...data, categories: newCategories });
    };

    const handleAddExpense = (categoryId, newExpense) => {
        updateCategoryAndSelection(categoryId, (expenses) => [...expenses, newExpense]);
    };

    const handleUpdateExpense = (categoryId, updatedExpense) => {
        updateCategoryAndSelection(categoryId, (expenses) => 
            expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp)
        );
    };

    const handleDeleteExpense = (categoryId, expenseId) => {
        updateCategoryAndSelection(categoryId, (expenses) => 
            expenses.filter(exp => exp.id !== expenseId)
        );
    };
    
    const handleDuplicateExpense = (categoryId, expenseId) => {
        const category = data.categories.find(c => c.id === categoryId);
        if (!category) return;

        const expenseToDuplicate = category.expenses.find(e => e.id === expenseId);
        if (!expenseToDuplicate) return;

        const duplicatedExpense = {
            ...expenseToDuplicate,
            id: Date.now(),
            description: `${expenseToDuplicate.description} (Cópia)`,
            paidInstallments: 0,
            paymentHistory: expenseToDuplicate.status === 'Fixa-Variável' ? [] : undefined,
        };

        updateCategoryAndSelection(categoryId, (expenses) => [...expenses, duplicatedExpense]);
    };

    const handleMarkAsPaid = (categoryId, expenseId) => {
        updateCategoryAndSelection(categoryId, (expenses) => 
            expenses.map(exp => {
                if (exp.id === expenseId && (exp.paidInstallments || 0) < exp.installments) {
                    return { ...exp, paidInstallments: (exp.paidInstallments || 0) + 1 };
                }
                return exp;
            })
        );
    };

    const handleToggleExpensePause = (categoryId, expenseId) => {
        updateCategoryAndSelection(categoryId, (expenses) =>
            expenses.map(exp =>
                exp.id === expenseId ? { ...exp, isPaused: !exp.isPaused } : exp
            )
        );
    };

    const handleOpenPaymentModal = (expense) => {
        setExpenseToPay(expense);
        setPaymentModalOpen(true);
    };

    const handleConfirmPayment = (paidAmount) => {
        if (!expenseToPay) return;
        const categoryId = selectedCategory.id;

        updateCategoryAndSelection(categoryId, (expenses) => 
            expenses.map(exp => {
                if (exp.id === expenseToPay.id) {
                    const newHistory = [...(exp.paymentHistory || []), { date: new Date().toISOString(), amount: paidAmount }];
                    return {
                        ...exp,
                        paidInstallments: (exp.paidInstallments || 0) + 1,
                        installmentValue: paidAmount,
                        paymentHistory: newHistory,
                    };
                }
                return exp;
            })
        );
        setPaymentModalOpen(false);
        setExpenseToPay(null);
    };

    const handleUndoPayment = (categoryId, expenseId) => {
        updateCategoryAndSelection(categoryId, (expenses) => 
            expenses.map(exp => {
                if (exp.id === expenseId && (exp.paidInstallments || 0) > 0) {
                    const paidCount = exp.paidInstallments || 0;
                    if (exp.status === 'Fixa-Variável') {
                        const newHistory = [...(exp.paymentHistory || [])];
                        newHistory.pop();
                        const lastPaymentValue = newHistory.length > 0 ? newHistory[newHistory.length - 1].amount : exp.totalValue;
                        return {
                            ...exp,
                            paidInstallments: paidCount - 1,
                            paymentHistory: newHistory,
                            installmentValue: lastPaymentValue,
                        };
                    }
                    return { ...exp, paidInstallments: paidCount - 1 };
                }
                return exp;
            })
        );
    };

    // Funções para exportar e importar os dados do orçamento como um arquivo JSON.
    const handleExportData = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const timestamp = `${year}-${month}-${day}_${hours}h${minutes}m`;
        const filename = `orcamento_${timestamp}.json`;
        
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = filename;
        link.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const importData = (jsonString) => {
        try {
            const importedData = JSON.parse(jsonString);
            if (typeof importedData.income === 'number' && Array.isArray(importedData.categories)) {
                setInitialData(importedData); // Usa setInitial para não criar histórico na importação
            } else {
                console.error("Estrutura do JSON inválida");
            }
        } catch (error) {
            console.error("Falha ao analisar o JSON", error);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                if (data.income === 0 && data.categories.length === 0) {
                    importData(text);
                } else {
                    setFileToImport(text);
                    setImportConfirmOpen(true);
                }
            };
            reader.readAsText(file);
        }
        event.target.value = null;
    };

    const confirmImportData = () => {
        if (fileToImport) {
            importData(fileToImport);
        }
        setImportConfirmOpen(false);
        setFileToImport(null);
    };

    const categoriesForDisplay = tempPresetCategories || data.categories;
    const totalBudgeted = categoriesForDisplay.reduce((sum, cat) => sum + (cat.budgetedValue || 0), 0);
    const totalPercentage = data.income > 0 ? (totalBudgeted / data.income) * 100 : 0;
    const isBudgetUnbalanced = Math.abs(100 - totalPercentage) >= 0.1 && categoriesForDisplay.length > 0;

    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-200 pb-40">
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes pulse-border { 0%, 100% { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 50% { border-color: rgba(59, 130, 246, 1); box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.2); } }
                .animate-pulse-border { animation: pulse-border 2s infinite; border: 2px solid; }
                @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
            `}</style>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileSelect} />
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Controle de Orçamento Pessoal</h1>
                    <p className="text-center text-gray-400 mt-2">Controle suas finanças de forma simples e visual.</p>
                </header>
                
                <main>
                    {selectedCategory ? (
                        <ExpenseList 
                            category={{...selectedCategory, expenses: selectedCategory.expenses || []}} 
                            onBack={handleBackToCategories} 
                            onUpdateExpense={handleUpdateExpense} 
                            onDeleteExpense={handleDeleteExpense} 
                            onAddExpense={handleAddExpense}
                            onMarkAsPaid={handleMarkAsPaid}
                            onUndoPayment={handleUndoPayment}
                            onOpenPaymentModal={handleOpenPaymentModal}
                            onTogglePause={handleToggleExpensePause}
                            onDuplicateExpense={handleDuplicateExpense}
                        />
                    ) : (
                        <CategoryList
                            categories={data.categories}
                            income={data.income}
                            onSelectCategory={handleSelectCategory}
                            onUpdateIncome={handleUpdateIncome}
                            onUpdateCategoryBudget={handleUpdateCategoryBudget}
                            onOpenCategoryModal={handleOpenCategoryModal}
                            onDeleteCategoryRequest={handleDeleteCategoryRequest}
                            onDeleteGroupRequest={handleDeleteGroupRequest}
                            onOpenPresetModal={() => setIsPresetModalOpen(true)}
                            onExport={handleExportData}
                            onImport={handleImportClick}
                            tempPresetCategories={tempPresetCategories}
                            onConfirmPreset={handleConfirmPreset}
                            onCancelPreset={handleCancelPreset}
                            onToggleLock={handleToggleCategoryLock}
                            onMoveItem={handleMoveItem}
                            onOpenEditGroupModal={handleOpenEditGroupModal}
                            undo={undo}
                            redo={redo}
                            canUndo={canUndo}
                            canRedo={canRedo}
                        />
                    )}
                </main>

                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Desenvolvido para facilitar sua vida financeira.</p>
                </footer>

                <Modal isOpen={isCategoryModalOpen} onClose={handleCloseCategoryModal}>
                    <CategoryForm 
                        onSubmit={handleCategorySubmit} 
                        onCancel={handleCloseCategoryModal} 
                        categoryData={editingCategory}
                        existingGroups={existingGroups}
                    />
                </Modal>
                <PaymentAmountModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
                    onSubmit={handleConfirmPayment}
                    expense={expenseToPay}
                />
                <ConfirmationModal 
                    isOpen={isDeleteConfirmOpen} 
                    onClose={() => setDeleteConfirmOpen(false)} 
                    onConfirm={confirmDeleteCategory} 
                    title="Excluir Categoria" 
                    message="Tem certeza que deseja excluir esta categoria e todas as suas despesas? Esta ação não pode ser desfeita."
                />
                <ConfirmationModal 
                    isOpen={isDeleteGroupConfirmOpen} 
                    onClose={() => setDeleteGroupConfirmOpen(false)} 
                    onConfirm={confirmDeleteGroup} 
                    title="Excluir Grupo" 
                    message={`Tem certeza que deseja excluir o grupo "${groupToDelete}"? As categorias dentro dele não serão excluídas, apenas ficarão sem grupo.`}
                />
                <ConfirmationModal 
                    isOpen={isImportConfirmOpen} 
                    onClose={() => setImportConfirmOpen(false)} 
                    onConfirm={confirmImportData} 
                    title="Importar Dados" 
                    message="Isto irá substituir todos os dados atuais. Tem certeza que deseja continuar?"
                />
                <PresetModal 
                    isOpen={isPresetModalOpen} 
                    onClose={() => setIsPresetModalOpen(false)} 
                    onSelectPreset={handleSelectPreset}
                />
                <EditGroupModal
                    isOpen={isEditGroupModalOpen}
                    onClose={handleCloseEditGroupModal}
                    onSubmit={handleUpdateGroupName}
                    groupName={editingGroup}
                />
            </div>
            {isBudgetUnbalanced && !tempPresetCategories && <BudgetAdjustmentBar totalPercentage={totalPercentage} onAdjust={handleAutoAdjustBudget} />}
        </div>
    );
}

// Expõe o componente para ser usado no app.js
window.OrcamentoPage = OrcamentoPage;
