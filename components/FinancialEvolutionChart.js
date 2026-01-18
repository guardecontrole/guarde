const FinancialEvolutionChart = ({ data }) => {
    const { useState } = React;
    const [visibility, setVisibility] = useState({
        balance: true,
        saldoSugerido: true,
        expense: false,
        stabilityReserve: true,
        avgIncome: false
    });

    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
    };

    // Formatação consistente de valores
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);

    // Cores do gráfico alinhadas com as variáveis CSS
    const CHART_COLORS = {
        balance: '#0ea5e9',      // Cyan-500 (Renda Líquida)
        saldoSugerido: '#8b5cf6', // Violet-500 (Saldo Sugerido)
        expense: '#ef4444',      // Red-500 (Saída)
        stabilityReserve: '#10b981', // Emerald-500 (Reserva)
        avgIncome: '#f59e0b'     // Yellow-500 (Média)
    };

    return (
        <div id="financial-chart" className="card-glass p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-100">Evolução Financeira</h2>
                    <p className="text-gray-400 text-sm mt-1">Análise dos últimos 12 meses</p>
                </div>
                <div className="mt-3 md:mt-0">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-800/70 border border-gray-700 text-xs text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
                        <span>Linha sólida = Dado Real</span>
                        <div className="w-2 h-2 rounded-full bg-violet-500 mx-3 ml-4 border border-dashed"></div>
                        <span>Linha tracejada = Meta/Projeção</span>
                    </div>
                </div>
            </div>

            <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                    <ComposedChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                    >
                        {/* Grade de fundo mais sutil */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(75, 85, 99, 0.3)"
                            vertical={false}
                        />

                        {/* Eixos com estilo refinado */}
                        <XAxis
                            dataKey="monthName"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: 'rgba(75, 85, 99, 0.5)' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: 'rgba(75, 85, 99, 0.5)' }}
                            tickFormatter={(value) => {
                                if (value >= 1000) return `R$${(value / 1000).toFixed(0)}k`;
                                return `R$${value}`;
                            }}
                        />

                        {/* Tooltip customizado */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(55, 65, 81, 0.5)',
                                borderRadius: '10px',
                                color: '#f3f4f6',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                            }}
                            formatter={(value, name) => {
                                const nameMap = {
                                    'balance': 'Renda Líquida',
                                    'saldoSugerido': 'Saldo Sugerido',
                                    'expense': 'Saída Mensal',
                                    'stabilityReserve': 'Reserva',
                                    'avgIncome': 'Média de Entradas'
                                };
                                return [formatCurrency(value), nameMap[name] || name];
                            }}
                            labelStyle={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: '5px' }}
                        />

                        {/* Legenda interativa */}
                        <Legend
                            onClick={handleLegendClick}
                            wrapperStyle={{
                                paddingTop: '20px',
                                fontSize: '13px',
                                cursor: 'pointer'
                            }}
                            iconType="circle"
                            iconSize={10}
                        />

                        {/* Linhas do gráfico com estilo aprimorado */}
                        <Line
                            type="monotone"
                            dataKey="balance"
                            name="Renda Líquida Mensal"
                            stroke={CHART_COLORS.balance}
                            strokeWidth={3}
                            dot={{ r: 4, fill: CHART_COLORS.balance, strokeWidth: 2, stroke: '#0c4a6e' }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                            hide={!visibility.balance}
                        />
                        <Line
                            type="monotone"
                            dataKey="saldoSugerido"
                            name="Saldo Sugerido"
                            stroke={CHART_COLORS.saldoSugerido}
                            strokeWidth={2.5}
                            strokeDasharray="5 5"
                            dot={false}
                            hide={!visibility.saldoSugerido}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            name="Saída Mensal"
                            stroke={CHART_COLORS.expense}
                            strokeWidth={2}
                            dot={{ r: 3, fill: CHART_COLORS.expense }}
                            hide={!visibility.expense}
                        />
                        <Line
                            type="monotone"
                            dataKey="stabilityReserve"
                            name="Reserva de Estabilidade"
                            stroke={CHART_COLORS.stabilityReserve}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: CHART_COLORS.stabilityReserve }}
                            hide={!visibility.stabilityReserve}
                        />
                        <Line
                            type="monotone"
                            dataKey="avgIncome"
                            name="Média de Entradas (12m)"
                            stroke={CHART_COLORS.avgIncome}
                            strokeWidth={2}
                            strokeDasharray="3 3"
                            dot={false}
                            hide={!visibility.avgIncome}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Nota informativa */}
            <div className="mt-6 pt-4 border-t border-gray-800/50">
                <p className="text-xs text-gray-500 text-center">
                    💡 <span className="text-gray-400">Clique nos itens da legenda para mostrar/ocultar linhas do gráfico.</span>
                </p>
            </div>
        </div>
    );
};

// Exporta globalmente
window.FinancialEvolutionChart = FinancialEvolutionChart;
