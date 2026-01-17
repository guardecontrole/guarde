const OnboardingModal = ({ onSave, onCancel }) => {
    const { useState } = React;
    const [initialAverage, setInitialAverage] = useState('');
    const [months, setMonths] = useState('');

    const handleSave = () => {
        const avg = parseFloat(initialAverage);
        const numMonths = parseInt(months, 10);
        if (isNaN(avg) || avg <= 0 || isNaN(numMonths) || numMonths <= 0 || numMonths > 120) {
             alert("Por favor, insira valores válidos (Média > 0, Meses entre 1 e 120).");
            return;
        }
        onSave(avg, numMonths);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Configuração Inicial</h2>
                <p className="text-gray-400 mb-6">Para que o "Saldo Sugerido" funcione bem, precisamos de uma base. Como você prefere começar?</p>
                <div className="space-y-4">
                    <button onClick={onCancel} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
                        Começar do Zero
                    </button>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-500">OU</span></div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-left">
                        <p className="text-gray-300 mb-2 font-semibold">Já tem um controle financeiro?</p>
                        <p className="text-sm text-gray-400 mb-4">Informe sua média de saldo mensal e por quantos meses você a calculou.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label htmlFor="avg-input" className="block text-sm font-medium text-gray-400 mb-1">Sua Média de Saldo (R$)</label>
                                <input 
                                    id="avg-input"
                                    type="number" 
                                    step="0.01" 
                                    value={initialAverage}
                                    onChange={(e) => setInitialAverage(e.target.value)}
                                    placeholder="Ex: 4500.50" 
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                 <label htmlFor="months-input" className="block text-sm font-medium text-gray-400 mb-1">Nº de Meses</label>
                                <input 
                                    id="months-input"
                                    type="number"
                                    value={months}
                                    onChange={(e) => setMonths(e.target.value)}
                                    placeholder="Ex: 6" 
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                        <button onClick={handleSave} className="mt-4 w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors">
                            Salvar Média Inicial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.OnboardingModal = OnboardingModal;
