const LeanTimesCalculatorModal = ({ isOpen, onClose, currentMonthIncome, currentMonthBalance, currentReserve, onApply }) => {
    const { useState, useEffect } = React;
    const [nextMonthIncome, setNextMonthIncome] = useState('');
    const [suggestedLimit, setSuggestedLimit] = useState(null);
    const [baseType, setBaseType] = useState('income');
    const [reserveWithdrawal, setReserveWithdrawal] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setNextMonthIncome('');
            setSuggestedLimit(null);
            setReserveWithdrawal(0);
            setBaseType('income');
        }
    }, [isOpen]);

    const baseValue = baseType === 'income' ? currentMonthIncome : currentMonthBalance;

    const calculate = () => {
        const nextInc = parseFloat(nextMonthIncome);
        if (isNaN(nextInc) || nextInc < 0) {
            alert("Por favor, insira um valor válido para a receita prevista.");
            return;
        }
        
        const limit = (baseValue + currentReserve + nextInc) / 2;
        setSuggestedLimit(limit);

        const withdrawal = limit - baseValue;
        setReserveWithdrawal(withdrawal);
    };

    const handleApply = () => {
        if (reserveWithdrawal > 0) {
            onApply(reserveWithdrawal);
            onClose();
        } else {
            alert("O valor calculado não exige retirada da reserva (você está economizando!). Nenhum ajuste necessário.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                        <CalculatorIcon />
                        Calculadora "Vacas Magras"
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                
                <p className="text-gray-400 mb-6 text-sm">
                    Calcule um teto de gastos seguro para tempos difíceis.
                </p>

                <div className="space-y-4 mb-6">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-300 mb-2">1. Escolha a base de cálculo para este mês:</p>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="baseType" 
                                    checked={baseType === 'income'} 
                                    onChange={() => setBaseType('income')}
                                    className="mr-2 text-blue-500 focus:ring-blue-500"
                                />
                                <span className={`text-sm ${baseType === 'income' ? 'text-white' : 'text-gray-400'}`}>
                                    Total Entradas ({currentMonthIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                                </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="baseType" 
                                    checked={baseType === 'balance'} 
                                    onChange={() => setBaseType('balance')}
                                    className="mr-2 text-blue-500 focus:ring-blue-500"
                                />
                                <span className={`text-sm ${baseType === 'balance' ? 'text-white' : 'text-gray-400'}`}>
                                    Saldo Atual ({currentMonthBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Reserva Atual</p>
                            <p className="text-lg font-bold text-purple-400">{currentReserve.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Previsão Próximo Mês</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                value={nextMonthIncome}
                                onChange={(e) => setNextMonthIncome(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
                        Calcular Limite
                    </button>
                </div>

                {suggestedLimit !== null && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-green-900/40 border border-green-600/50 p-4 rounded-lg text-center">
                            <p className="text-gray-300 text-sm mb-1">Seu Teto de Gastos Sugerido:</p>
                            <p className="text-3xl font-bold text-green-400">{suggestedLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            <p className="text-xs text-gray-400 mt-2 italic">Fórmula: (Base + Reserva + Próximo) / 2</p>
                        </div>

                        {reserveWithdrawal > 0 ? (
                            <div className="bg-yellow-900/40 border border-yellow-600/50 p-4 rounded-lg text-center">
                                <p className="text-gray-300 text-sm mb-1">Necessário retirar da Reserva:</p>
                                <p className="text-xl font-bold text-yellow-400">{reserveWithdrawal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                <button 
                                    onClick={handleApply}
                                    className="mt-3 w-full py-2 bg-yellow-700 hover:bg-yellow-600 text-white text-sm font-semibold rounded transition-colors">
                                    Confirmar e Descontar da Reserva
                                </button>
                            </div>
                        ) : (
                            <div className="bg-blue-900/40 border border-blue-600/50 p-3 rounded-lg text-center">
                                <p className="text-gray-300 text-sm">Este plano não exige retirada da reserva. Você conseguirá economizar!</p>
                            </div>
                        )}
                    </div>
                )}
                
                 <div className="mt-6 text-right">
                     <button onClick={onClose} className="text-sm text-gray-400 hover:text-white underline">Fechar</button>
                 </div>
            </div>
        </div>
    );
};

window.LeanTimesCalculatorModal = LeanTimesCalculatorModal;
