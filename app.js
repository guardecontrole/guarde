const { useState, useEffect } = React;

// --- ÍCONES ---
const Icon = ({ name, size = 24, className = "" }) => {
    const icons = {
        'dashboard': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
        'wallet': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
        'target': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
        'log-out': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
        'sun': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
        'moon': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    };
    return icons[name] || null;
};

// --- LAYOUT COM TEMA ---
const Layout = ({ children, activePage, onNavigate, user, onLogout, isDark, toggleTheme }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'orcamento', label: 'Orçamento', icon: 'wallet' },
        { id: 'simulacao', label: 'Simulação', icon: 'target' },
    ];

    return (
        <div className="flex h-screen bg-app text-main font-sans overflow-hidden transition-colors duration-300">
            {/* SIDEBAR (Desktop) */}
            <aside className="hidden md:flex w-72 flex-col bg-sidebar transition-colors duration-300 z-20">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">CF</div>
                    <h1 className="text-2xl font-bold tracking-tight">Financely</h1>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group font-medium ${
                                activePage === item.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                : 'text-sec hover-item hover:text-main'
                            }`}
                        >
                            <Icon name={item.icon} className={activePage === item.id ? 'text-white' : 'text-sec group-hover:text-main'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="bg-app rounded-2xl p-4 flex items-center gap-3 mb-4 border border-transparent hover:border-gray-700 transition">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.email?.split('@')[0]}</p>
                            <p className="text-xs text-sec">Plano Grátis</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-sm text-sec hover:text-red-500 transition-colors">
                        <Icon name="log-out" size={18} /> Sair da conta
                    </button>
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Header Mobile */}
                <header className="md:hidden h-16 bg-header flex items-center justify-between px-6 shadow-sm z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">CF</div>
                        <span className="text-lg font-bold">Financeiro</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={toggleTheme} className="text-sec hover:text-main"><Icon name={isDark ? 'sun' : 'moon'} size={20}/></button>
                        <button onClick={onLogout} className="text-sec hover:text-red-500"><Icon name="log-out" size={20}/></button>
                    </div>
                </header>

                {/* Header Desktop */}
                <header className="hidden md:flex h-24 items-center justify-between px-8 bg-app transition-colors duration-300">
                    <div>
                        <p className="text-sm text-sec font-medium">Pages / {activePage.charAt(0).toUpperCase() + activePage.slice(1)}</p>
                        <h2 className="text-3xl font-bold mt-1">
                            {activePage === 'dashboard' ? 'Dashboard Principal' : activePage === 'orcamento' ? 'Orçamento Mensal' : 'Simulação'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 bg-sidebar p-2 rounded-full shadow-sm border border-gray-800/10">
                        <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-app flex items-center justify-center text-main hover:scale-110 transition-transform" title="Trocar Tema">
                            <Icon name={isDark ? 'sun' : 'moon'} size={18} />
                        </button>
                    </div>
                </header>

                {/* Área de Scroll */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto pb-24 md:pb-0">
                        {children}
                    </div>
                </div>

                {/* Menu Inferior (Mobile) */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-sidebar border-t border-gray-800 flex justify-around items-center px-4 z-30 pb-2 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                                activePage === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 -translate-y-4' : 'text-sec'
                            }`}
                        >
                            <Icon name={item.icon} size={24} />
                        </button>
                    ))}
                </nav>
            </main>
        </div>
    );
};

// --- APP RAÍZ ---
const App = () => {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true); // Padrão: Escuro
    
    const [globalIncome, setGlobalIncome] = useState(0);

    // Efeito para trocar a classe no Body
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const unsubscribe = window.firebaseApp?.auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    const handleLogout = async () => {
        try { await window.firebaseApp.auth.signOut(); window.location.reload(); } 
        catch (error) { console.error("Erro ao sair", error); }
    };

    const updateIncome = (val) => setGlobalIncome(val);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return window.DashboardPage ? <window.DashboardPage user={user} onUpdateIncome={updateIncome} /> : <div className="text-center mt-10 opacity-50">Carregando Dashboard...</div>;
            case 'orcamento':
                return window.OrcamentoPage ? <window.OrcamentoPage initialIncome={globalIncome} /> : <div className="text-center mt-10 opacity-50">Carregando Orçamento...</div>;
            case 'simulacao':
                return <div className="flex items-center justify-center h-64 text-sec">Em breve...</div>;
            default: return <div>404</div>;
        }
    };

    if (loading) return <div className="min-h-screen bg-app flex items-center justify-center font-bold text-lg animate-pulse">Carregando...</div>;

    if (!user) {
        return (
            <div className="min-h-screen bg-app flex flex-col items-center justify-center p-6">
                <div className="bg-sidebar p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-gray-800">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-blue-600/30">CF</div>
                    <h1 className="text-2xl font-bold mb-2">Bem-vindo</h1>
                    <p className="text-sec mb-8">Controle financeiro pessoal.</p>
                    <a href="index.html" className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg">Fazer Login</a>
                </div>
            </div>
        );
    }

    return (
        <Layout 
            activePage={currentPage} 
            onNavigate={setCurrentPage} 
            user={user} 
            onLogout={handleLogout}
            isDark={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
        >
            {renderPage()}
        </Layout>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
