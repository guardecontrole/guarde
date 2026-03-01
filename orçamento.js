// orcamento.js - Novo Layout Imersivo e Futurista
const { useState, useEffect, useRef, useMemo } = React;

// Importação segura dos ícones modernos (lucide-react)
const { 
  ChevronDown, Layers, Plus, Edit, Trash2, Folder, Lock, Unlock, 
  MessageSquare, Undo2, Redo2, Copy, Pause, Play, Download, Upload, 
  ChevronRight, ArrowLeft, DollarSign, X, AlertTriangle, BookOpen, Star, BarChart3, Target
} = lucide;

// ==========================================
// 1. CONFIGURAÇÕES E DADOS
// ==========================================
const initialData = { income: 0, categories: [] };
const availableColors = ['border-cyan-500 text-cyan-400', 'border-pink-500 text-pink-400', 'border-green-500 text-green-400', 'border-blue-500 text-blue-400', 'border-yellow-500 text-yellow-400', 'border-purple-500 text-purple-400'];

const budgetPresets = [
    { name: 'Sugestão do App', description: 'Modelo balanceado.', icon: Star, categories: [ { name: '🏠 Casa', percentage: 27.5, color: availableColors[0], group: 'Custos de Vida' }, { name: '👶 Filhos', percentage: 21.5, color: availableColors[2], group: 'Custos de Vida' }, { name: '👤 Pessoal', percentage: 23.5, color: availableColors[5], group: 'Custos de Vida' }, { name: '🚗 Carro', percentage: 17.5, color: availableColors[3], group: 'Custos de Vida' }, { name: '👵 Aposentadoria', percentage: 10.0, color: availableColors[4], group: 'Investimentos' } ] },
    { name: 'Pai Rico, Pai Pobre', description: 'Pague-se primeiro.', icon: BookOpen, categories: [ { name: '💰 Pague-se Primeiro', percentage: 30, color: availableColors[5], group: 'Investimentos' }, { name: '✅ Necessidades', percentage: 60, color: availableColors[0], group: 'Necessidades' }, { name: '🛍️ Desejos', percentage: 10, color: availableColors[1], group: 'Desejos' } ] },
    { name: '50/30/20', description: 'Clássico financeiro.', icon: BookOpen, categories: [ { name: '✅ Essenciais', percentage: 50, color: availableColors[0], group: 'Essenciais' }, { name: '🛍️ Não Essenciais', percentage: 30, color: availableColors[1], group: 'Não Essenciais' }, { name: '📈 Investimentos', percentage: 20, color: availableColors[5], group: 'Investimentos' } ] }
];

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(isNaN(v) ? 0 : v);

// ==========================================
// 2. COMPONENTES UI (FUTURISTAS)
// ==========================================
const GlassModal = ({ children, isOpen, onClose, maxWidth = "max-w-md" }) => !isOpen ? null : (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
        <div className={`bg-neutral-900/90 rounded-2xl shadow-neon w-full ${maxWidth} m-4 relative p-8 border border-cyan-500/20 animate-fade-in-up`}>
            <button onClick={ onClose } className="absolute top-5 right-5 text-cyan-600 hover:text-cyan-400 transition"><X size={24} /></button>
            { children }
        </div>
    </div>
);

const NeonButton = ({ children, icon: Icon, variant = "cyan", ...props }) => {
    const colorMap = {
        cyan: "border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 shadow-neon-cyan",
        pink: "border-pink-500 text-pink-400 hover:bg-pink-950/50 shadow-neon-pink",
        neutral: "border-neutral-700 text-neutral-400 hover:bg-neutral-800",
    };
    return (
        <button className={ `flex items-center gap-2 px-5 py-2.5 rounded-full border ${colorMap[variant]} font-bold transition hover:scale-105` } { ...props }>
            { Icon && <Icon size={20} /> }
            { children }
        </button>
    );
};

// ==========================================
// 3. CARD DE CATEGORIA (ITEM INDIVIDUAL)
// ==========================================
const CategoryItemFuturistic = ({ category, income, onUpdateBudget, onSelectCategory, onEdit, onDelete, isPreviewing, onToggleLock, dragProps }) => {
    const expenses = category.expenses || [];
    const spent = expenses.filter(e => !e.isPaused).reduce((a, b) => a + b.installmentValue, 0);
    const rest = (category.budgetedValue || 0) - spent;
    const progress = (category.budgetedValue || 0) > 0 ? Math.min((spent / category.budgetedValue) * 100, 100) : 0;
    
    return (
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 group hover:border-cyan-500/30 transition hover:shadow-neon-cyan/10">
            <div className="flex justify-between items-center mb-5">
                <div onClick={ () => !isPreviewing && onSelectCategory(category) } className="flex items-center gap-4 cursor-pointer flex-grow">
                    <div className={ `w-2 h-10 rounded-full ${category.color.split(' ')[0]}` }/>
                    <span className="font-semibold text-neutral-50 text-2xl tracking-tight">{category.name}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={ () => !isPreviewing && onToggleLock(category.id) } className={ `p-2 rounded-full hover:bg-neutral-800 ${category.isLocked ? 'text-pink-500' : 'text-neutral-500'}` }>{category.isLocked ? <Lock size={18}/> : <Unlock size={18}/>}</button>
                    <button onClick={ () => !isPreviewing && onEdit(category) } disabled={isPreviewing || category.isLocked} className="p-2 text-neutral-500 hover:text-cyan-400 transition disabled:opacity-50"><Edit size={20} /></button>
                    <button onClick={ () => !isPreviewing && onDelete(category.id) } disabled={isPreviewing} className="p-2 text-neutral-500 hover:text-pink-500 transition disabled:opacity-50"><Trash2 size={20} /></button>
                </div>
            </div>
            
            <div className="relative mb-5 group">
                <span className="absolute left-4 top-3 text-neutral-600 font-mono">R$</span>
                <input type="text" className="w-full bg-neutral-950 text-neutral-50 font-bold rounded-xl p-3 pl-10 border border-transparent focus:border-cyan-500 outline-none transition" value={ (category.budgetedValue || 0).toFixed(2).replace('.', ',') } onChange={ e => { if (!category.isLocked) onUpdateBudget(category.id, e.target.value, 'value'); } } disabled={category.isLocked}/>
            </div>
            
            <div className="flex justify-between text-xs font-medium text-neutral-400 mb-3">
                <span>Gasto: <span className="text-neutral-50">{formatCurrency(spent)}</span></span>
                <span className={ rest < 0 ? 'text-pink-500' : 'text-green-500' }>{rest < 0 ? 'Excedido' : 'Disponível'}: {formatCurrency(Math.abs(rest))}</span>
            </div>
            
            <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden border border-neutral-800">
                <div className={ `h-full rounded-full transition-all duration-500 ${rest < 0 ? 'bg-pink-500' : category.color.split(' ')[0]}` } style={{ width: `${progress}%` }}/>
            </div>
        </div>
    );
};

// ==========================================
// 4. LISTA DE CATEGORIAS E GRUPOS (CORE)
// ==========================================
const CategoryListFuturistic = ({ categories, income, onSelectCategory, onUpdateIncome, onUpdateCategoryBudget, onOpenCategoryModal, onDeleteCategoryRequest, onDeleteGroupRequest, onOpenPresetModal, onExport, onImport, tempPresetCategories, onConfirmPreset, onCancelPreset, onToggleLock, onMoveItem, onOpenEditGroupModal, undo, redo, canUndo, canRedo }) => {
    const cats = tempPresetCategories || categories || [];
    const totalExp = cats.reduce((acc, c) => acc + (c.expenses || []).filter(e => !e.isPaused).reduce((s, e) => s + e.installmentValue, 0), 0);
    const balance = income - totalExp;
    const hasIncome = income > 0;
    
    const [collapsed, setCollapsed] = useState({});

    const grouped = cats.filter(c => c.group && c.group.trim()).reduce((acc, c) => { (acc[c.group] = acc[c.group] || []).push(c); return acc; }, {});
    const orphans = cats.filter(c => !c.group || !c.group.trim());

    return (
        <div className="space-y-12 pb-40 text-neutral-50">
            {/* Painel de Comando de Resumo */}
            <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 flex flex-wrap gap-8 shadow-neon/10 animate-fade-in">
                <div className="flex-1 flex items-center gap-4 p-5 bg-neutral-950 rounded-2xl border border-neutral-800"><div className="p-3.5 bg-cyan-950 rounded-xl text-cyan-400"><DollarSign size={24}/></div><div><p className="text-neutral-500 text-xs">Renda Mensal</p><p className="text-3xl font-bold">{formatCurrency(income)}</p></div></div>
                <div className="flex-1 flex items-center gap-4 p-5 bg-neutral-950 rounded-2xl border border-neutral-800"><div className="p-3.5 bg-neutral-800 rounded-xl text-neutral-400"><Target size={24}/></div><div><p className="text-neutral-500 text-xs">Planejado</p><p className="text-3xl font-bold">{formatCurrency(totalExp)}</p></div></div>
                <div className="flex-1 flex items-center gap-4 p-5 bg-neutral-950 rounded-2xl border border-neutral-800"><div className={ `p-3.5 rounded-xl ${balance >= 0 ? 'bg-cyan-950 text-cyan-400' : 'bg-pink-950 text-pink-400'}` }><BarChart3 size={24}/></div><div><p className="text-neutral-500 text-xs">Saldo Livre</p><p className={ `text-3xl font-bold ${balance >= 0 ? 'text-neutral-50' : 'text-pink-400'}` }>{formatCurrency(balance)}</p></div></div>
            </div>

            <div className="bg-neutral-900/60 p-10 rounded-3xl border border-neutral-800 backdrop-blur">
                {/* Barra de Ferramentas Integrada */}
                <div className="flex flex-wrap gap-3 justify-end mb-10 pb-5 border-b border-neutral-800">
                    <button onClick={undo} disabled={!canUndo} className="p-3 bg-neutral-800 rounded-full text-neutral-400 disabled:opacity-30"><Undo2 size={22}/></button>
                    <button onClick={redo} disabled={!canRedo} className="p-3 bg-neutral-800 rounded-full text-neutral-400 disabled:opacity-30"><Redo2 size={22}/></button>
                    <div className="h-10 w-px bg-neutral-800 mx-2"></div>
                    <button onClick={onImport} className="p-3.5 bg-neutral-950 rounded-full text-neutral-400 hover:text-cyan-400 transition" title="Importar"><Upload size={22}/></button>
                    <button onClick={onExport} className="p-3.5 bg-neutral-950 rounded-full text-neutral-400 hover:text-cyan-400 transition" title="Exportar"><Download size={22}/></button>
                    <NeonButton onClick={onOpenCategoryModal} Icon={Plus}>Nova Categoria</NeonButton>
                </div>

                {cats.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-950">
                        <div className="p-4.5 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-5 text-cyan-400"><BarChart3 size={40}/></div>
                        <h3 className="text-2xl font-bold mb-3">Configure seu Fluxo</h3>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">Seu painel está pronto para receber suas diretrizes financeiras.</p>
                        <NeonButton onClick={onOpenPresetModal} Icon={BookOpen}>Usar Modelo</NeonButton>
                    </div>
                )}

                {/* --- GRUPOS FUTURISTAS --- */}
                {Object.entries(grouped).map(([grp, grpCats]) => {
                    const groupBudget = grpCats.reduce((a, c) => a + (c.budgetedValue || 0), 0);
                    const groupSpent = grpCats.reduce((a, c) => a + (c.expenses || []).filter(e => !e.isPaused).reduce((s, e) => s + e.installmentValue, 0), 0);
                    const groupProgress = groupBudget > 0 ? (groupSpent / groupBudget) * 100 : 0;

                    return (
                        <div key={grp} className="mb-8">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-neutral-950/60 p-4 rounded-xl mb-5 cursor-pointer group border border-neutral-800" onClick={ () => setCollapsed(p => ({...p, [grp]: !p[grp]})) }>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-800 rounded text-neutral-400"><Layers size={18}/></div>
                                    <span className="font-bold uppercase text-sm tracking-wider text-neutral-300">{grp}</span>
                                    <ChevronDown size={16} className={ `text-neutral-600 transition ${collapsed[grp] ? '-rotate-90' : ''}` }/>
                                </div>
                                <div className="flex items-center gap-4 mt-2 sm:mt-0 font-mono text-sm">
                                    <span className="text-neutral-500">Gasto:</span>
                                    <span className="font-bold">{formatCurrency(groupSpent)}</span>
                                    <span className="text-neutral-700">/</span>
                                    <span className="font-bold">{formatCurrency(groupBudget)}</span>
                                    <span className={ `font-bold ${groupProgress > 100 ? 'text-pink-500' : 'text-cyan-400'}` }>({groupProgress.toFixed(1)}%)</span>
                                </div>
                            </div>
                            
                            {!collapsed[grp] && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-2 animate-fade-in-down">
                                    {grpCats.map(c => <CategoryItemFuturistic key={c.id} category={c} income={income} onUpdateBudget={onUpdateCategoryBudget} onSelectCategory={onSelectCategory} onEdit={onOpenCategoryModal} onDelete={onDeleteCategoryRequest} isPreviewing={!!tempPresetCategories} onToggleLock={onToggleLock} dragProps={dragProps} />)}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {orphans.map(c => <CategoryItemFuturistic key={c.id} category={c} income={income} onUpdateBudget={onUpdateCategoryBudget} onSelectCategory={onSelectCategory} onEdit={onOpenCategoryModal} onDelete={onDeleteCategoryRequest} isPreviewing={!!tempPresetCategories} onToggleLock={onToggleLock} dragProps={dragProps} />)}
                </div>
            </div>
        </div>
    );
};

// Componente Principal
const OrcamentoPageFuturistic = ({ initialIncome = 0 }) => {
    // Carregamento de dados simplificado para demonstração
    const [data, setData] = useState({ income: initialIncome, categories: [] });
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Mocks das funções que seriam ligadas ao Firebase e ao Histórico
    const undo = () => {}; const redo = () => {}; const canUndo = false; const canRedo = false;
    const handleUpdateIncome = (val) => setData({...data, income: val});
    const handleUpdateCategoryBudget = (id, val, type) => {
        const v = parseFloat(String(val).replace(',', '.')) || 0;
        setData({...data, categories: data.categories.map(c => c.id === id ? {...c, budgetedValue: v} : c)});
    };
    const handleToggleCategoryLock = (id) => setData({...data, categories: data.categories.map(c => c.id === id ? {...c, isLocked: !c.isLocked} : c)});
    const handleMoveItem = () => {};

    // Estados dos modais
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

    return (
        <div className="font-sans text-neutral-50 pb-40 min-h-screen">
            <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in-down { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } } .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; } .shadow-neon { box-shadow: 0 0 30px rgba(34, 211, 238, 0.2); } .shadow-neon-cyan { box-shadow: 0 0 10px rgba(34, 211, 238, 0.4); } .shadow-neon-pink { box-shadow: 0 0 10px rgba(236, 72, 153, 0.4); }`}</style>
            
            <CategoryListFuturistic 
                categories={data.categories} 
                income={data.income} 
                onSelectCategory={() => {}} 
                onUpdateIncome={handleUpdateIncome} 
                onUpdateCategoryBudget={handleUpdateCategoryBudget} 
                onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
                onDeleteCategoryRequest={() => {}} 
                onDeleteGroupRequest={() => {}} 
                onOpenPresetModal={() => setIsPresetModalOpen(true)} 
                onExport={() => {}} 
                onImport={() => {}} 
                tempPresetCategories={null} 
                onConfirmPreset={() => {}} 
                onCancelPreset={() => {}} 
                onToggleLock={handleToggleCategoryLock} 
                onMoveItem={handleMoveItem} 
                onOpenEditGroupModal={() => {}} 
                undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} 
            />

            <GlassModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
                <h3 className="text-xl font-bold mb-5">Diretriz da Nova Categoria</h3>
                <input className="w-full bg-neutral-950 text-neutral-50 rounded p-3 mb-5" placeholder="Nome da Categoria" />
                <NeonButton>Criar</NeonButton>
            </GlassModal>
        </div>
    );
};

window.OrcamentoPage = OrcamentoPageFuturistic;
