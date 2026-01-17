const MonthlyBalanceHistoryTable = ({ data, isLoading, sortConfig, requestSort }) => { 
    const SortIndicator = window.SortIndicator;
    return (
        <div className="bg-gray-800/50 p-6 rounded-b-xl rounded-r-xl shadow-inner"> 
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Histórico de Saldo Mensal ({new Date().getFullYear()})</h2> 
            <div className="overflow-y-auto" style={{maxHeight: '350px'}}> 
                <table className="w-full text-left"> 
                    <thead className="sticky top-0 bg-gray-800"> 
                        <tr className="border-b-2 border-gray-700 bg-gray-700/50"> 
                            <th className="p-3 text-sm font-semibold text-gray-400 cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('month')}> 
                                <div className="flex items-center justify-start group"> <span>Mês</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="month" /></span> </div> 
                            </th> 
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('income')}> 
                                <div className="flex items-center justify-end group"> <span>Entradas</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="income" /></span> </div> 
                            </th> 
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('expense')}> 
                                <div className="flex items-center justify-end group"> <span>Saídas</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="expense" /></span> </div> 
                            </th> 
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('balance')}> 
                                <div className="flex items-center justify-end group"> <span>Saldo do Mês</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="balance" /></span> </div> 
                            </th> 
                        </tr> 
                    </thead> 
                    <tbody> 
                        {data.map((monthData) => ( 
                            <tr key={monthData.month} className="border-b border-gray-700 hover:bg-gray-700/70"> 
                                <td className="p-3 text-gray-300 capitalize">{monthData.monthName}</td> 
                                <td className="p-3 text-green-400 font-medium text-right"> {monthData.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </td> 
                                <td className="p-3 text-red-400 font-medium text-right"> {monthData.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </td> 
                                <td className={`p-3 font-bold text-right ${monthData.balance >= 0 ? 'text-blue-400' : 'text-yellow-400'}`}> {monthData.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </td> 
                            </tr> 
                        ))} 
                        {data.length === 0 && !isLoading && ( 
                            <tr> 
                                <td colSpan="4" className="text-center text-gray-500 py-4"> Nenhuma atividade registrada para este ano. </td> 
                            </tr> 
                        )} 
                    </tbody> 
                </table> 
            </div> 
        </div> 
    );
};

window.MonthlyBalanceHistoryTable = MonthlyBalanceHistoryTable;
