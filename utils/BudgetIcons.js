// utils/BudgetIcons.js
const { createElement } = React;

// Componente base para SVG
const IconBase = ({ children, size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

// Definição dos ícones
const icons = {
    ChevronRight: (props) => <IconBase {...props}><path d="m9 18 6-6-6-6"/></IconBase>,
    Folder: (props) => <IconBase {...props}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></IconBase>,
    Plus: (props) => <IconBase {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>,
    Edit: (props) => <IconBase {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></IconBase>,
    Trash2: (props) => <IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>,
    ArrowLeft: (props) => <IconBase {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconBase>,
    DollarSign: (props) => <IconBase {...props}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></IconBase>,
    Percent: (props) => <IconBase {...props}><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></IconBase>,
    X: (props) => <IconBase {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>,
    AlertTriangle: (props) => <IconBase {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></IconBase>,
    BookOpen: (props) => <IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>,
    Star: (props) => <IconBase {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></IconBase>,
    Upload: (props) => <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></IconBase>,
    Download: (props) => <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></IconBase>,
    Check: (props) => <IconBase {...props}><path d="M20 6 9 17l-5-5"/></IconBase>,
    RefreshCw: (props) => <IconBase {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></IconBase>,
    Eye: (props) => <IconBase {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></IconBase>,
    Layers: (props) => <IconBase {...props}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0l-9.17-4.16"/></IconBase>,
    ChevronDown: (props) => <IconBase {...props}><path d="m6 9 6 6 6-6"/></IconBase>,
    Lock: (props) => <IconBase {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></IconBase>,
    Unlock: (props) => <IconBase {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></IconBase>,
    MessageSquare: (props) => <IconBase {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></IconBase>,
    CheckCircle: (props) => <IconBase {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></IconBase>,
    Undo2: (props) => <IconBase {...props}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></IconBase>,
    Redo2: (props) => <IconBase {...props}><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></IconBase>,
    Pause: (props) => <IconBase {...props}><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></IconBase>,
    Play: (props) => <IconBase {...props}><polygon points="5 3 19 12 5 21 5 3"/></IconBase>,
    Copy: (props) => <IconBase {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></IconBase>,
    MoreVertical: (props) => <IconBase {...props}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></IconBase>
};

// Exporta para o escopo global
window.BudgetIcons = icons;
