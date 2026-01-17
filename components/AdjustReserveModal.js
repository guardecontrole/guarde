const AdjustReserveModal = ({ isOpen, onClose, currentCalculatedReserve, onConfirm, currentMonthBalance, suggestedBalance }) => {
    const { useState, useEffect } = React;
    const [realReserve, setRealReserve] = useState('');
    const [deficit, setDeficit] = useState(0);
    const [adjustmentType, setAdjustmentType] = useState('correction');

    useEffect(() => {
        if (isOpen) {
            setRealReserve('');
            setAdjustmentType('correction');
            const gap = suggestedBalance - currentMonthBalance;
            setDeficit(gap > 0 ? gap : 0);
        }
    }, [isOpen, currentMonthBalance, suggestedBalance]);

    const handleConfirm = () => {
        const value = parseFloat(realReserve);
        if (isNaN(value)) {
            alert("Por favor, insira um valor válido.");
            return;
        }
        onConfirm(value, adjustmentType);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Ajustar Reserva Manualmente</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Valor Calculado pelo App:</p>
                        <p className="text-xl font-bold text-gray-300">{currentCalculatedReserve.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                    
                    {deficit > 0 && parseFloat(realReserve) !== 0 && (
                        <div className="bg-yellow-900/40 border border-yellow-600/50 p-3 rounded-lg text-sm">
                            <p className="font-bold text-yellow-400 mb-1">Atenção!</p>
                            <p className="text-gray-300 mb-2">
                                Seu saldo atual está abaixo do sugerido. Faltam <span className="font-bold">{deficit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>.
                            </p>
                            <p className="text-gray-400 text-xs">
                                Ao confirmar, esse valor será automaticamente <strong>retirado da reserva</strong> para cobrir a meta (registrado como "Resgate").
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">Qual o valor REAL da reserva hoje?</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={realReserve}
                            onChange={(e) => setRealReserve(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ex: 5000.00"
                        />
                    </div>
                    
                    {parseFloat(realReserve) === 0 ? (
                        <div className="bg-red-900/40 border border-red-600/50 p-3 rounded-lg text-sm mt-2 animate-pulse">
                            <p className="font-bold text-red-400 mb-1">Reiniciar Reserva?</p>
                            <p className="text-gray-300 text-xs">
                                Definir como <strong>0</strong> irá apagar todos os ajustes manuais e resgates automáticos anteriores, permitindo recalcular e reajustar do zero.
                            </p>
                        </div>
                    ) : (
                        realReserve && (
                            <div className="bg-gray-700/50 p-3 rounded-lg space-y-2">
                                <p className="text-sm font-medium text-gray-300">Qual a origem da diferença?</p>
                                <div className="space-y-2">
                                    <label className="flex items-start cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="adjustmentType" 
                                            value="correction"
                                            checked={adjustmentType === 'correction'}
                                            onChange={() => setAdjustmentType('correction')}
                                            className="mt-1 mr-2 text-purple-500 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-400">
                                            <span className="block text-white font-medium">Apenas Correção / Saldo Antigo</span>
                                            <span className="text-xs">O dinheiro já estava lá (ou não estava), apenas esqueci de anotar. (Não afeta relatórios de Renda)</span>
                                        </span>
                                    </label>
                                    <label className="flex items-start cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="adjustmentType" 
                                            value="movement"
                                            checked={adjustmentType === 'movement'}
                                            onChange={() => setAdjustmentType('movement')}
                                            className="mt-1 mr-2 text-purple-500 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-gray-400">
                                            <span className="block text-white font-medium">Nova Movimentação Real</span>
                                            <span className="text-xs">Ganhei ou gastei esse dinheiro hoje. (Afeta relatórios como Entrada/Saída)</span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )
                    )}

                    {deficit > 0 && realReserve && parseFloat(realReserve) !== 0 && (
                        <div className="text-xs text-gray-500 mt-1 border-t border-gray-700 pt-2">
                            <p>Cálculo Final:</p>
                            <p>Reserva Informada: {parseFloat(realReserve).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            <p className="text-red-400">- Cobertura de Saldo: {deficit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            <p className="font-bold text-purple-400">= Nova Reserva no App: {(parseFloat(realReserve) - deficit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    )}

                    <button onClick={handleConfirm} className={`w-full mt-4 py-2 text-white font-bold rounded-lg transition-colors ${parseFloat(realReserve) === 0 ? 'bg-red-600 hover:bg-red-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
                        {parseFloat(realReserve) === 0 ? 'Confirmar Reset' : 'Confirmar e Ajustar'}
                    </button>
                    <button onClick={onClose} className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

window.AdjustReserveModal = AdjustReserveModal;
