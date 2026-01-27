const { useState, useEffect } = React;

// --- ÍCONES GERAIS DO SISTEMA ---
const Icon = ({ name, size = 24, className = "" }) => {
    const icons = {
        'dashboard': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
        'wallet': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
        'target': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
        'log-out': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
        'menu': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    };
    return icons[name] || null;
};

// --- COMPONENTE DE LAYOUT (ESQUELETO) ---
const Layout = ({ children, activePage, onNavigate, user, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'orcamento', label: 'Orçamento', icon: 'wallet' },
        { id: 'simulacao', label: 'Simulação', icon: 'target' },
    ];

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
            {/* --- SIDEBAR (Desktop) --- */}
            <aside className="hidden md:flex w-64 flex-col bg-gray-900 border-r border-gray-800 shadow-2xl z-20">
                <div className="p-6 flex flex-col items-center justify-center border-b border-gray-800/50">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                        <span className="font-bold text-xl">CF</span>
                    </div>
                    <h1 className="text-lg font-bold text-white tracking-wide">Controle Financeiro</h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                                activePage === item.id 
                                ? 'bg-blue-600/10 text-blue-400 font-semibold shadow-inner' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                            }`}
                        >
                            {activePage === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>}
                            <Icon name={item.icon} className={`transition-colors ${activePage === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800/50 bg-gray-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2 p-2 rounded-lg bg-gray-800/30">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold border border-gray-500">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-gray-200">{user?.email}</p>
                            <p className="text-[10px] text-gray-500">Conta Gratuita</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                        <Icon name="log-out" size={16} /> Sair
                    </button>
                </div>
            </aside>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0B0E14]">
                {/* Header Mobile */}
                <header className="md:hidden h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-20 sticky top-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-sm">CF</span>
                        </div>
                        <span className="text-lg font-bold text-white">Financeiro</span>
                    </div>
                    <button onClick={onLogout} className="p-2 text-gray-400 hover:text-white"><Icon name="log-out" size={20}/></button>
                </header>

                {/* Área de Scroll */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
                        {children}
                    </div>
                </div>

                {/* Menu Inferior (Mobile) */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 flex justify-around items-center px-2 z-30 pb-4">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all ${
                                activePage === item.id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${activePage === item.id ? 'bg-blue-500/20' : 'bg-transparent'}`}>
                                <Icon name={item.icon} size={22} className={activePage === item.id ? 'fill-current' : ''} />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </main>
        </div>
    );
};

// --- APP PRINCIPAL ---
const App = () => {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    
    // Dados globais simulados (para comunicação entre Dashboard e Orçamento)
    // Em uma versão avançada, usaríamos Context API
    const [globalIncome, setGlobalIncome] = useState(0);

    useEffect(() => {
        // Verifica autenticação
        const unsubscribe = window.firebaseApp?.auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
            if (!u && window.location.pathname !== '/index.html' && !window.location.pathname.includes('login')) {
                // window.location.href = 'index.html'; // Comente se estiver testando sem login
            }
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await window.firebaseApp.auth.signOut();
            window.location.reload();
        } catch (error) {
            console.error("Erro ao sair", error);
        }
    };

    // Função para atualizar a receita global (vinda do Dashboard)
    const updateIncome = (val) => {
        setGlobalIncome(val);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return window.DashboardPage ? (
                    <div className="animate-fade-in">
                        <window.DashboardPage user={user} onUpdateIncome={updateIncome} />
                    </div>
                ) : <div className="text-center text-gray-500 mt-20">Carregando Dashboard...</div>;
            
            case 'orcamento':
                return window.OrcamentoPage ? (
                    <div className="animate-fade-in">
                        <window.OrcamentoPage initialIncome={globalIncome} />
                    </div>
                ) : <div className="text-center text-gray-500 mt-20">Carregando Orçamento...</div>;
            
            case 'simulacao':
                return (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500 animate-fade-in">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Icon name="target" size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Simulação de Cenários</h2>
                        <p>Esta funcionalidade estará disponível em breve.</p>
                    </div>
                );
            default:
                return <div className="text-white">Página não encontrada</div>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-500 font-medium animate-pulse">Iniciando sistema...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center text-white p-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
                    <span className="font-bold text-2xl">CF</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta</h1>
                <p className="text-gray-400 mb-8 text-center max-w-sm">Seu controle financeiro pessoal, simplificado e poderoso.</p>
                <a href="index.html" className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all hover:scale-105 shadow-lg shadow-blue-600/25">Fazer Login</a>
            </div>
        );
    }

    return (
        <Layout activePage={currentPage} onNavigate={setCurrentPage} user={user} onLogout={handleLogout}>
            {renderPage()}
        </Layout>
    );
};

// Inicializa o App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
