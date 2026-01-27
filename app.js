const { useState, useEffect } = React;

// --- ÍCONES (Estilo Clean/Financely) ---
const Icon = ({ name, size = 20, className = "" }) => {
    const icons = {
        'dashboard': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
        'wallet': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>,
        'target': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
        'log-out': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
        'sun': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
        'moon': <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    };
    return icons[name] || null;
};

// --- LAYOUT PRINCIPAL ---
const Layout = ({ children, activePage, onNavigate, user, onLogout, isDark, toggleTheme }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'orcamento', label: 'Orçamento', icon: 'wallet' },
        { id: 'simulacao', label: 'Simulação', icon: 'target' },
    ];

    return (
        <div className="flex h-screen bg-app text-main font-sans overflow-hidden transition-colors duration-300">
            {/* SIDEBAR (Desktop) - Estilo Financely */}
            <aside className="hidden md:flex w-[290px] flex-col bg-sidebar transition-colors duration-300 z-20 border-r border-border">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                        F
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-title font-poppins">Financely</h1>
                </div>
                
                <nav className="flex-1 px-6 space-y-4 mt-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group font-medium relative ${
                                activePage === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/40 translate-x-1' 
                                : 'text-sec hover:bg-hover hover:text-main'
                            }`}
                        >
                            <Icon name={item.icon} className={activePage === item.id ? 'text-white' : 'text-sec group-hover:text-primary'} />
                            {item.label}
                            {activePage === item.id && <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </button>
                    ))}
                </nav>

                {/* Card de Usuário no Menu */}
                <div className="p-6 mt-auto">
                    <div className="bg-card rounded-3xl p-1 flex items-center gap-3 mb-4 shadow-sm border border-border">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md ml-2">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden py-2">
                            <p className="text-sm font-bold truncate text-title">{user?.email?.split('@')[0]}</p>
                            <p className="text-[10px] text-sec uppercase tracking-wider font-bold">Free Plan</p>
                        </div>
                        <button onClick={onLogout} className="p-2 mr-1 text-sec hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <Icon name="log-out" size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-app transition-colors duration-300">
                {/* Header Mobile */}
                <header className="md:hidden h-20 bg-sidebar flex items-center justify-between px-6 shadow-sm z-20 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">F</div>
                        <span className="text-lg font-bold text-title">Financely</span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={toggleTheme} className="p-2 text-sec bg-hover rounded-xl"><Icon name={isDark ? 'sun' : 'moon'} size={20}/></button>
                    </div>
                </header>

                {/* Header Desktop (Barra Superior) */}
                <header className="hidden md:flex h-24 items-center justify-between px-10 bg-app transition-colors duration-300">
                    <div>
                        <p className="text-sm text-sec font-medium mb-1">Pages / {activePage.charAt(0).toUpperCase() + activePage.slice(1)}</p>
                        <h2 className="text-3xl font-bold text-title tracking-tight">
                            {activePage === 'dashboard' ? 'Dashboard Principal' : activePage === 'orcamento' ? 'Controle de Orçamento' : 'Simulação'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 bg-sidebar p-2.5 rounded-full shadow-lg shadow-gray-200/5 dark:shadow-black/20 border border-border">
                        <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-hover flex items-center justify-center text-main hover:text-primary transition-all">
                            <Icon name={isDark ? 'sun' : 'moon'} size={20} />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Área de Scroll */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto pb-24 md:pb-8">
                        {children}
                    </div>
                </div>

                {/* Menu Inferior (Mobile) */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-sidebar border-t border-border flex justify-around items-center px-4 z-30 pb-2 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                                activePage === item.id ? 'bg-primary text-white shadow-lg shadow-primary/30 -translate-y-5' : 'text-sec'
                            }`}
                        >
                            <Icon name={item.icon} size={24} />
                        </button>
                    ))}
                    <button onClick={onLogout} className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-sec hover:text-red-500">
                        <Icon name="log-out" size={24} />
                    </button>
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
    const [isDarkMode, setIsDarkMode] = useState(true); // Padrão Dark
    
    const [globalIncome, setGlobalIncome] = useState(0);

    // Gerenciamento de Tema
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    }, [isDarkMode]);

    useEffect(() => {
        // CORREÇÃO DO LOGIN: Verifica usuário
        if (!window.firebaseApp) {
            console.error("Firebase não inicializado!");
            return;
        }
        const unsubscribe = window.firebaseApp.auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // FUNÇÃO DE LOGIN CORRIGIDA (Chama o Google Pop-up)
    const handleLogin = async () => {
        try {
            const provider = new window.firebase.auth.GoogleAuthProvider();
            await window.firebaseApp.auth.signInWithPopup(provider);
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro ao fazer login. Tente novamente.");
        }
    };

    const handleLogout = async () => {
        try { await window.firebaseApp.auth.signOut(); } 
        catch (error) { console.error("Erro ao sair", error); }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return window.DashboardPage ? <window.DashboardPage user={user} onUpdateIncome={setGlobalIncome} /> : <div className="text-center mt-20 text-sec">Carregando Dashboard...</div>;
            case 'orcamento':
                return window.OrcamentoPage ? <window.OrcamentoPage initialIncome={globalIncome} /> : <div className="text-center mt-20 text-sec">Carregando Orçamento...</div>;
            case 'simulacao':
                return <div className="flex flex-col items-center justify-center h-96 text-sec"><div className="w-20 h-20 bg-card rounded-full flex items-center justify-center shadow-lg mb-4 text-4xl">🚧</div><h3 className="text-xl font-bold text-title">Em Breve</h3><p>Simulação de cenários em desenvolvimento.</p></div>;
            default: return <div>404</div>;
        }
    };

    if (loading) return <div className="min-h-screen bg-app flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    // TELA DE LOGIN (Se não estiver logado)
    if (!user) {
        return (
            <div className="min-h-screen bg-app flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decorativo */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 blur-[100px] rounded-full"></div>
                </div>

                <div className="bg-sidebar p-10 rounded-[30px] shadow-2xl w-full max-w-md text-center border border-border relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white text-3xl font-bold shadow-lg shadow-primary/40">
                        F
                    </div>
                    <h1 className="text-3xl font-bold text-title mb-3 font-poppins">Bem-vindo</h1>
                    <p className="text-sec mb-10 text-lg">Gerencie suas finanças com inteligência e estilo.</p>
                    
                    {/* BOTÃO CORRIGIDO */}
                    <button 
                        onClick={handleLogin} 
                        className="w-full py-4 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Entrar com Google
                    </button>
                </div>
                
                <p className="mt-8 text-sec text-sm">Desenvolvido com foco em performance</p>
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
