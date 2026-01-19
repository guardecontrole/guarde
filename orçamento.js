import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Search, DollarSign, Pause, Check, MoreVertical, 
  Edit, Copy, Play, Undo2, Trash2 
} from 'lucide-react';

// Importe seus componentes existentes aqui (ajuste o caminho se necessário)
// Se estiverem no mesmo arquivo, você não precisa desses imports.
import { Modal, ConfirmationModal } from './components/Modal'; 
import { ExpenseForm } from './components/Forms';
import { formatCurrency } from './utils';

const Orcamento = ({ 
    category, 
    onBack, 
    onUpdateExpense, 
    onDeleteExpense, 
    onAddExpense, 
    onMarkAsPaid, 
    onUndoPayment, 
    onOpenPaymentModal, 
    onTogglePause, 
    onDuplicateExpense 
}) => {
    // --- ESTADOS (A lógica que faz os modais abrirem e fecharem) ---
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    
    const [editingExpense, setEditingExpense] = useState(null); 
    const [expenseToDelete, setExpenseToDelete] = useState(null); 
    const [selectedExpenseForAction, setSelectedExpenseForAction] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');

    // --- FUNÇÕES (O que acontece quando clica nos botões) ---

    const handleOpenAddModal = () => {
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
        if (expenseToDelete) {
            onDeleteExpense(category.id, expenseToDelete);
            setExpenseToDelete(null);
            setConfirmationModalOpen(false);
        }
    };

    const handleFormSubmit = (expenseData) => {
        if (editingExpense) {
            onUpdateExpense(category.id, { ...expenseData, id: editingExpense.id });
        } else {
            onAddExpense(category.id, { ...expenseData, id: Date.now(), paidInstallments: 0 });
        }
        setExpenseModalOpen(false);
    };

    const openActionsModal = (expense) => {
        setSelectedExpenseForAction(expense);
        setActionModalOpen(true);
    };

    const closeActionsModal = () => {
        setActionModalOpen(false);
        setSelectedExpenseForAction(null);
    };

    // Filtra as despesas pela busca
    const filteredExpenses = category.expenses.filter(expense => 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalPlanned = category.expenses.reduce((acc, curr) => acc + curr.installmentValue, 0);

    // --- O QUE APARECE NA TELA (JSX) ---
    return (
        <div className="animate-fade-in space-y-6 p-4 md:p-6 bg-gray-900 min-h-screen text-gray-100">
            {/* 1. Cabeçalho da Categoria */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                        {category.name}
                    </h2>
                    <p className="text-gray-400 text-sm">Gerencie suas despesas</p>
                </div>
            </div>

            {/* 2. Card de Resumo Financeiro */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Total Planejado</p>
                        <h3 className="text-3xl font-bold text-white">{formatCurrency(totalPlanned)}</h3>
                    </div>
                    <div className="text-right">
                         <p className="text-gray-400 text-sm mb-1">Disponível</p>
                         <p className={`text-xl font-bold ${(category.budgetedValue - totalPlanned) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {formatCurrency(category.budgetedValue - totalPlanned)}
                         </p>
                    </div>
                </div>
                {/* Barra de Progresso Visual */}
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                        className={`h-3 rounded-full transition-all duration-500 ${category.color}`} 
                        style={{ width: `${Math.min((totalPlanned / (category.budgetedValue || 1)) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* 3. Barra de Busca e Botão Nova Despesa */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-auto flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar despesa..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-semibold shadow-lg transform hover:scale-105">
                    <Plus size={20} /> Nova Despesa
                </button>
            </div>

            {/* 4. Lista de Despesas */}
            <div className="space-y-3">
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                        <p>Nenhuma despesa nesta categoria.</p>
                    </div>
                ) : (
                    filteredExpenses.map(expense => (
                        <div key={expense.id} className={`bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition flex items-center justify-between group ${expense.isPaused ? 'opacity-60 grayscale' : ''}`}>
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className={`p-3 rounded-lg flex-shrink-0 ${expense.isPaused ? 'bg-gray-700' : 'bg-gray-700/50 text-blue-400'}`}>
                                    {expense.isPaused ? <Pause size={20} /> : <DollarSign size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-white truncate">{expense.description}</h4>
                                    <div className="text-xs text-gray-400 flex items-center gap-2">
                                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                                        {expense.installments > 1 && <span>• {expense.paidInstallments}/{expense.installments}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                                <div className="text-right">
                                    <p className="font-bold text-white">{formatCurrency(expense.installmentValue)}</p>
                                    {expense.isPaused && <span className="text-xs text-yellow-500 font-medium">Pausada</span>}
                                </div>
                                
                                {/* Botão Check (Pagar) */}
                                {(!expense.isPaused && ((expense.paidInstallments || 0) < expense.installments || expense.status === 'Fixa-Variável')) && (
                                     <button 
                                        onClick={() => expense.status === 'Variável' ? onOpenPaymentModal(expense) : onMarkAsPaid(category.id, expense.id)}
                                        className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition"
                                     >
                                        <Check size={18} />
                                     </button>
                                )}

                                {/* Menu de Ações (...) */}
                                <button onClick={() => openActionsModal(expense)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- MODAIS (O Código que você pediu) --- */}
            
            {/* Modal de Criar/Editar Despesa */}
            <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)}>
                <ExpenseForm 
                    onSubmit={handleFormSubmit} 
                    onCancel={() => setExpenseModalOpen(false)} 
                    expenseData={editingExpense} 
                />
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <ConfirmationModal 
                isOpen={isConfirmationModalOpen} 
                onClose={() => setConfirmationModalOpen(false)} 
                onConfirm={confirmDelete} 
                title="Excluir Despesa" 
                message="Tem certeza que deseja excluir esta despesa?" 
            />

            {/* Modal de Ações Rápidas (Editar, Duplicar, Pausar) */}
            <Modal isOpen={isActionModalOpen} onClose={closeActionsModal} maxWidth="max-w-sm">
                {selectedExpenseForAction && (
                    <div className="text-white">
                        <h3 className="text-lg font-bold mb-4 text-center">Opções: "{selectedExpenseForAction.description}"</h3>
                        <div className="flex flex-col gap-2">
                            {/* Editar */}
                            <button onClick={() => handleEditClick(selectedExpenseForAction)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition">
                                <Edit size={16} /> Editar
                            </button>
                            
                            {/* Duplicar */}
                            <button onClick={() => { onDuplicateExpense(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition">
                                <Copy size={16} /> Duplicar
                            </button>
                            
                            {/* Pausar/Reativar */}
                            <button onClick={() => { onTogglePause(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition">
                                {selectedExpenseForAction.isPaused ? <Play size={16} /> : <Pause size={16} />}
                                {selectedExpenseForAction.isPaused ? 'Reativar' : 'Pausar'}
                            </button>

                            {/* Desfazer Pagamento (Só aparece se já pagou algo) */}
                            {(selectedExpenseForAction.paidInstallments || 0) > 0 && (
                                <button onClick={() => { onUndoPayment(category.id, selectedExpenseForAction.id); closeActionsModal(); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-yellow-400 hover:bg-yellow-500/20 rounded-md transition">
                                    <Undo2 size={16} /> Desfazer Pagamento
                                </button>
                            )}
                            
                            <div className="w-full h-px bg-gray-600 my-1"></div>
                            
                            {/* Excluir */}
                            <button onClick={() => handleDeleteRequest(selectedExpenseForAction.id)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-md transition">
                                <Trash2 size={16} /> Excluir
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orcamento;
