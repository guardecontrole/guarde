// orcamento.js - Layout Imersivo/Futurista (BLINDADO - Sem dependências externas)
const { useState, useEffect, useRef, useMemo } = React;

// ==========================================
// 1. ÍCONES (SVG NATIVO E SEGURO)
// ==========================================
const IconBase = ({ children, size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const Folder = (p) => <IconBase {...p}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></IconBase>;
const Plus = (p) => <IconBase {...p}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>;
const Edit = (p) => <IconBase {...p}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></IconBase>;
const Trash2 = (p) => <IconBase {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>;
const ArrowLeft = (p) => <IconBase {...p}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconBase>;
const DollarSign = (p) => <IconBase {...p}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>;
const X = (p) => <IconBase {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>;
const AlertTriangle = (p) => <IconBase {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></IconBase>;
const BookOpen = (p) => <IconBase {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>;
const Star = (p) => <IconBase {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase>;
const Upload = (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></IconBase>;
const Download = (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></IconBase>;
const CheckCircle = (p) => <IconBase {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></IconBase>;
const Layers = (p) => <IconBase {...p}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/></IconBase>;
const ChevronDown = (p) => <IconBase {...p}><path d="m6 9 6 6 6-6"/></IconBase>;
const Lock = (p) => <IconBase {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></IconBase>;
const Unlock = (p) => <IconBase {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></IconBase>;
const Undo2 = (p) => <IconBase {...p}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></IconBase>;
const Redo2 = (p) => <IconBase {...p}><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></IconBase>;
const Target = (p) => <IconBase {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></IconBase>;
const BarChart3 = (p) => <IconBase {...p}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></IconBase>;

// ==========================================
// 2. CONFIGURAÇÕES E DADOS
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
// 3. COMPONENTES UI (FUTURISTAS)
// ==========================================
const GlassModal = ({ children, isOpen, onClose, maxWidth = "max-w-md" }) => !isOpen ? null : (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
        <div className={`bg-neutral-900/90 rounded-2xl shadow-neon w-full ${maxWidth} m-4 relative p-8 border border-cyan-500/20 animate-fade-in`}>
            <button onClick={ onClose } className="absolute top-5 right-5 text-cyan-600 hover:text-cyan-400 transition"><X size={24} /></button>
            { children }
        </div>
    </div>
);

const NeonButton = ({ children, icon: Icon, variant = "cyan", onClick }) => {
    const colorMap = {
        cyan: "border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 shadow-neon",
        pink: "border-pink-500 text-pink-400 hover:bg-pink-950/50 shadow-neon",
    };
    return (
        <button onClick={onClick} className={ `flex items-center gap-2 px-5 py-2.5 rounded-full border ${colorMap[variant] || colorMap.cyan} font-bold transition hover:scale-105` }>
            { Icon && <Icon size={20} /> }
            { children }
        </button>
    );
};

// ==========================================
// 4. CARD DE CATEGORIA (ITEM INDIVIDUAL)
// ==========================================
const CategoryItemFuturistic = ({ category, income, onUpdateBudget, onSelectCategory, onEdit, onDelete, isPreviewing, onToggleLock, dragProps }) => {
    const expenses = category.expenses || [];
    const spent = expenses.filter(e => !e.isPaused).reduce((a, b) => a + b.installmentValue, 0);
    const rest = (category.budgetedValue || 0) - spent;
    const progress = (category.budgetedValue || 0) > 0 ? Math.min((spent / category.budgetedValue) * 100, 100) : 0;
    
    return (
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 group hover:border-cyan-500/30 transition hover:shadow-neon">
            <div className="flex justify-between items-center mb-5">
                <div onClick={ () => !isPreviewing && onSelectCategory(category) } className="flex items-center gap-4 cursor-pointer flex-grow">
                    <div className={ `w-2 h-10 rounded-full ${category.color.split(' ')[0]}` }/>
                    <span className="font-semibold text-neutral-50 text-xl tracking-tight">{category.name}</span>
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
// 5. LISTA DE CATEGORIAS E GRUPOS (CORE)
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
            <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 flex flex-wrap gap-8 animate-fade-in shadow-neon">
                <div className="flex-1 flex items-center gap-4 p-5 bg-neutral-950 rounded-2xl border border-neutral-800"><div className="p-3.5 bg-cyan-950/30 rounded-xl text-cyan-400"><DollarSign size={24}/></div><div><p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Renda Mensal</p><p className="text-3xl font-bold font-mono">{formatCurrency(income)}</p></div></div>
                <div className="flex-1 flex items-center gap-4 p-5 bg-neutral-950 rounded-2xl border border-neutral-800"><div className="p-3.5 bg-neutral-800 rounded-xl text-neutral-400"><Target size={24}/></div><div><p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Planejado</p><p className="text-3xl font-bold font-mono">{formatCurrency(totalExp)}</p></div></div>
                <div className="flex-1 flex items-center gap-4 p-5 bg-neutral-950 rounded-2xl border border-neutral-800"><div className={ `p-3.5 rounded-xl ${balance >= 0 ? 'bg-cyan-950/30 text-cyan-400' : 'bg-pink-950/30 text-pink-400'}` }><BarChart3 size={24}/></div><div><p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Saldo Livre</p><p className={ `text-3xl font-bold font-mono ${balance >= 0 ? 'text-neutral-50' : 'text-pink-400'}` }>{formatCurrency(balance)}</p></div></div>
            </div>

            <div className="glass-panel p-10 rounded-3xl border border-neutral-800">
                {/* Barra de Ferramentas Integrada */}
                <div className="flex flex-wrap gap-3 justify-end mb-10 pb-5 border-b border-neutral-800">
                    <button onClick={undo} disabled={!canUndo} className="p-3 bg-neutral-800 rounded-full text-neutral-400 disabled:opacity-30"><Undo2 size={22}/></button>
                    <button onClick={redo} disabled={!canRedo} className="p-3 bg-neutral-800 rounded-full text-neutral-400 disabled:opacity-30"><Redo2 size={22}/></button>
                    <div className="h-10 w-px bg-neutral-800 mx-2"></div>
                    <button onClick={onImport} className="p-3.5 bg-neutral-950 rounded-full text-neutral-400 hover:text-cyan-400 transition" title="Importar"><Upload size={22}/></button>
                    <button onClick={onExport} className="p-3.5 bg-neutral-950 rounded-full text-neutral-400 hover:text-cyan-400 transition" title="Exportar"><Download size={22}/></button>
                    <NeonButton onClick={onOpenCategoryModal} icon={Plus}>Nova Categoria</NeonButton>
                </div>

                {cats.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-neutral-800 rounded-2xl bg-neutral-950">
                        <div className="p-4 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-5 text-cyan-400 w-16 h-16"><BarChart3 size={32}/></div>
                        <h3 className="text-2xl font-bold mb-3">Configure seu Fluxo</h3>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto font-medium">Seu painel está pronto para receber suas diretrizes financeiras.</p>
                        <div className="flex justify-center">
                           <NeonButton onClick={onOpenPresetModal} icon={BookOpen}>Usar Modelo</NeonButton>
                        </div>
                    </div>
                )}

                {/* --- GRUPOS FUTURISTAS --- */}
                {Object.entries(grouped).map(([grp, grpCats]) => {
                    const groupBudget = grpCats.reduce((a, c) => a + (c.budgetedValue || 0), 0);
                    const groupSpent = grpCats.reduce((a, c) => a + (c.expenses || []).filter(e => !e.isPaused).reduce((s, e) => s + e.installmentValue, 0), 0);
                    const groupProgress = groupBudget > 0 ? (groupSpent / groupBudget) * 100 : 0;

                    return (
                        <div key={grp} className="mb-8">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-neutral-950/60 p-4 rounded-xl mb-5 cursor-pointer group border border-neutral-800 hover:border-cyan-500/30 transition" onClick={ () => setCollapsed(p => ({...p, [grp]: !p[grp]})) }>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-800 rounded text-neutral-400"><Layers size={18}/></div>
                                    <span className="font-bold uppercase text-sm tracking-wider text-neutral-300 font-poppins">{grp}</span>
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-2 animate-fade-in">
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

            {/* PRESET CONFIRMATION E BUDGET BAR */}
            {!!tempPresetCategories && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel p-4 flex justify-between items-center gap-8 rounded-full z-50 shadow-neon">
                    <p className="text-white font-bold px-4">Carregar Protocolo {tempPresetCategories.length} categorias?</p>
                    <div className="flex gap-2">
                        <button onClick={onCancelPreset} className="px-5 py-2 bg-neutral-800 text-white rounded-full font-bold hover:bg-neutral-700">Abortar</button>
                        <button onClick={onConfirmPreset} className="px-5 py-2 bg-cyan-600 text-black rounded-full font-bold hover:bg-cyan-500 shadow-neon">Injetar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente Principal
const OrcamentoPageFuturistic = ({ initialIncome = 0 }) => {
    const [data, setData] = useState({ income: initialIncome, categories: [] });
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Mocks seguros para evitar erros
    const undo = () => {}; const redo = () => {}; const canUndo = false; const canRedo = false;
    const handleUpdateIncome = (val) => setData({...data, income: val});
    const handleUpdateCategoryBudget = (id, val, type) => {
        const v = parseFloat(String(val).replace(',', '.')) || 0;
        setData({...data, categories: data.categories.map(c => c.id === id ? {...c, budgetedValue: v} : c)});
    };
    const handleToggleCategoryLock = (id) => setData({...data, categories: data.categories.map(c => c.id === id ? {...c, isLocked: !c.isLocked} : c)});
    const handleMoveItem = () => {};

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
    const [tempPresetCategories, setTempPresetCategories] = useState(null);

    return (
        <div className="font-sans text-neutral-50 min-h-screen">
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
                tempPresetCategories={tempPresetCategories} 
                onConfirmPreset={() => { setData({...data, categories: tempPresetCategories}); setTempPresetCategories(null); }} 
                onCancelPreset={() => { setTempPresetCategories(null); }} 
                onToggleLock={handleToggleCategoryLock} 
                onMoveItem={handleMoveItem} 
                onOpenEditGroupModal={() => {}} 
                undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} 
            />

            <GlassModal isOpen={isPresetModalOpen} onClose={() => setIsPresetModalOpen(false)} maxWidth="max-w-4xl">
                <h3 className="text-2xl font-bold mb-6 text-center text-neon">Bancos de Dados Prontos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgetPresets.map(p => (
                        <div key={p.name} onClick={() => { setTempPresetCategories(p.categories.map(c => ({...c, id: Date.now()+Math.random(), budgetedValue: (data.income * c.percentage)/100, expenses: [], isLocked: false}))); setIsPresetModalOpen(false); }} className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 hover:border-cyan-500/50 cursor-pointer transition shadow-neon">
                            <div className="flex items-center mb-3 text-cyan-400"><p.icon size={24} className="mr-3" /><h4 className="text-lg font-bold">{p.name}</h4></div>
                            <p className="text-neutral-500 text-sm mb-4">{p.description}</p>
                            <div className="flex flex-wrap gap-2">{p.categories.map(c => <span key={c.name} className="text-xs bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-400 font-mono">{c.name} {c.percentage}%</span>)}</div>
                        </div>
                    ))}
                </div>
            </GlassModal>

            <GlassModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
                <h3 className="text-xl font-bold mb-5 text-neon text-cyan-400">Diretriz da Nova Categoria</h3>
                <input className="w-full bg-neutral-950 text-neutral-50 rounded-lg p-3 mb-5 border border-neutral-800 focus:border-cyan-500 outline-none" placeholder="Nome da Categoria" />
                <input className="w-full bg-neutral-950 text-neutral-50 rounded-lg p-3 mb-5 border border-neutral-800 focus:border-cyan-500 outline-none" placeholder="Grupo de Alocação" />
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setIsCategoryModalOpen(false)} className="px-5 py-2 bg-neutral-800 rounded-lg font-bold">Cancelar</button>
                    <button onClick={() => setIsCategoryModalOpen(false)} className="px-5 py-2 bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 rounded-lg font-bold shadow-neon transition">Salvar Protocolo</button>
                </div>
            </GlassModal>
        </div>
    );
};

window.OrcamentoPage = OrcamentoPageFuturistic;
