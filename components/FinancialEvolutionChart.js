const FinancialEvolutionChart = ({ data }) => { 
    const { useState } = React;
    const [visibility, setVisibility] = useState({ balance: true, saldoSugerido: true, expense: true, stabilityReserve: true, avgIncome: false }); 
    const handleLegendClick = (e) => { const { dataKey } = e; setVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] })); }; 
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); 
    const formatCompactCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value); 
    
    return ( 
        <div id="financial-chart" className="bg-gray-800 p-6 rounded-xl shadow-md"> 
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Evolução Financeira (Últimos 12 Meses)</h2> 
            <div style={{ width: '100%', height: 350 }}> 
                <ResponsiveContainer> 
                    <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}> 
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" /> 
                        <XAxis dataKey="monthName" stroke="#A0AEC0" /> 
                        <YAxis stroke="#A0AEC0" tickFormatter={formatCompactCurrency} /> 
                        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', color: '#E2E8F0' }} formatter={(value, name) => [formatCurrency(value), name]} /> 
                        <Legend onClick={handleLegendClick} wrapperStyle={{ color: '#E2E8F0', cursor: 'pointer' }} /> 
                        
                        <Line type="monotone" dataKey="balance" name="Renda Líquida Mensal" stroke="#48BB78" strokeWidth={2} hide={!visibility.balance} /> 
                        <Line type="monotone" dataKey="saldoSugerido" name="Saldo Sugerido" stroke="#4299E1" strokeDasharray="5 5" strokeWidth={2} hide={!visibility.saldoSugerido} /> 
                        <Line type="monotone" dataKey="avgIncome" name="Média de Entradas (12m)" stroke="#9F7AEA" strokeDasharray="3 3" strokeWidth={2} hide={visibility.avgIncome === false} /> 
                        <Line type="monotone" dataKey="expense" name="Saída Mensal" stroke="#F56565" strokeWidth={2} hide={!visibility.expense} /> 
                        <Line type="monotone" dataKey="stabilityReserve" name="Reserva de Estabilidade" stroke="#A0AEC0" strokeWidth={2} hide={!visibility.stabilityReserve} /> 
                    </ComposedChart> 
                </ResponsiveContainer> 
            </div> 
        </div> 
    ); 
};

window.FinancialEvolutionChart = FinancialEvolutionChart;
