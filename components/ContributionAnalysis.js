const ContributionAnalysis = ({ contributionData, individualAverages }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
    const chartData = contributionData.map(d => ({ name: d.name, value: d.value }));

    return (
        <div className="bg-gray-800/50 p-6 rounded-b-xl rounded-r-xl shadow-inner space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-700/30 p-4 rounded-xl flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Contribuição de Renda (Este Ano)</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 my-10">Sem dados de renda para este ano.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Médias de Entradas (Últimos 12 Meses)</h3>
                    {individualAverages.map((item, index) => (
                        <div key={item.name} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="font-medium text-gray-200">{item.name}</span>
                            </div>
                            <div className="text-right">
                                 <span className="block text-xl font-bold text-green-400">
                                    {item.avg.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    <span className="text-xs text-gray-500 font-normal ml-1">/mês</span>
                                </span>
                                <span className="text-xs text-gray-400">({item.monthsCount} meses ativos)</span>
                            </div>
                        </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-2">
                        * Média calculada apenas sobre os meses com contribuição.
                    </p>
                </div>
            </div>
        </div>
    );
};

window.ContributionAnalysis = ContributionAnalysis;
