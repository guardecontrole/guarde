const StabilityReserveHistoryTable = ({ data, sortConfig, requestSort }) => {
    const SortIndicator = window.SortIndicator;
    const icons = window.icons;
    return ( 
        <div className="bg-gray-800/50 p-6 rounded-b-xl rounded-r-xl shadow-inner"> 
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Histórico da Reserva de Estabilidade</h2> 
            <div className="overflow-y-auto" style={{maxHeight: '350px'}}> 
                <table className="w-full text-left"> 
                    <thead className="sticky top-0 bg-gray-800"> 
                        <tr className="border-b-2 border-gray-700 bg-gray-700/50"> 
                            <th className="p-3 text-sm font-semibold text-gray-400 cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('monthKey')}> 
                                <div className="flex items-center justify-start group"> <span>Mês</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="monthKey" /></span> </div> 
                            </th> 
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('amountAdded')}> 
                                <div className="flex items-center justify-end group"> <span>Valor Guardado</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="amountAdded" /></span> </div> 
                            </th> 
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('totalReserve')}> 
                                <div className="flex items-center justify-end group"> <span>Total na Reserva</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="totalReserve" /></span> </div> 
                            </th> 
                        </tr> 
                    </thead> 
                    <tbody> 
                        {data.map((monthData) => ( 
                            <tr key={monthData.monthKey} className="border-b border-gray-700 hover:bg-gray-700/70"> 
                                <td className="p-3 text-gray-300 capitalize">
                                    {monthData.monthName}
                                    {monthData.hasAdjustment && (
                                        <span title="Houve um ajuste manual no saldo da reserva neste mês." className="cursor-help">
                                            <icons.InfoIcon />
                                        </span>
                                    )}
                                </td> 
                                <td className={`p-3 font-medium text-right ${ monthData.amountAdded > 0 ? 'text-green-400' : monthData.amountAdded < 0 ? 'text-red-400' : 'text-gray-400' }`}> {monthData.amountAdded.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </td> 
                                <td className="p-3 text-purple-400 font-bold text-right"> {monthData.totalReserve.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </td> 
                            </tr> 
                        ))} 
                        {data.length === 0 && ( 
                            <tr> 
                                <td colSpan="3" className="text-center text-gray-500 py-4"> Dados insuficientes para calcular o histórico. </td> 
                            </tr> 
                        )} 
                    </tbody> 
                </table> 
            </div> 
        </div> 
    );
};

window.StabilityReserveHistoryTable = StabilityReserveHistoryTable;
