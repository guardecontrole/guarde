const RecordsTable = ({ title, records, onDelete, onEdit, type, sortConfig, requestSort, isSimulation, participants }) => {
    const showResponsible = participants && participants.length > 1;
    const SortIndicator = window.SortIndicator;
    const icons = window.icons;

    return (
        <div className="bg-gray-800/50 p-6 rounded-b-xl rounded-r-xl shadow-inner"> 
            <h3 className="text-xl font-semibold text-gray-200 mb-4">{title}</h3> 
            {records.length > 0 ? ( 
                <div className="overflow-x-auto max-h-[400px]"> 
                    <table className="w-full text-left"> 
                        <thead> 
                            <tr className="border-b-2 border-gray-700 bg-gray-700/50 sticky top-0"> 
                                <th className="p-3 text-sm font-semibold text-gray-400 cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('month')}> 
                                    <div className="flex items-center justify-start group"> <span>Mês</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="month" /></span> </div> 
                                </th> 
                                <th className={`p-3 text-sm font-semibold text-gray-400 cursor-pointer hover:bg-gray-700/70 ${showResponsible ? 'w-1/3' : 'w-1/2'}`} onClick={() => requestSort('description')}> 
                                    <div className="flex items-center justify-start group"> <span>Descrição</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="description" /></span> </div> 
                                </th> 
                                 {showResponsible && (
                                     <th className="p-3 text-sm font-semibold text-gray-400 w-1/6 cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('responsible')}>
                                         <div className="flex items-center justify-start group"><span>Resp.</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="responsible" /></span></div>
                                     </th>
                                 )}
                                <th className="p-3 text-sm font-semibold text-gray-400 text-right cursor-pointer hover:bg-gray-700/70" onClick={() => requestSort('amount')}> 
                                    <div className="flex items-center justify-end group"> <span>Valor</span> <span className="ml-2"><SortIndicator sortConfig={sortConfig} columnKey="amount" /></span> </div> 
                                </th> 
                                <th className="p-3 text-sm font-semibold text-gray-400 text-center">Ações</th> 
                            </tr> 
                        </thead> 
                        <tbody> 
                            {records.map((record) => ( 
                                <tr key={record.id} className={`border-b border-gray-700 hover:bg-gray-700/70 ${record.isSimulated ? 'italic text-cyan-400' : ''}`}> 
                                    <td className="p-3 text-gray-300 capitalize">{new Date(record.year, record.month).toLocaleString('pt-BR', { month: 'short' }).replace('.','')}</td> 
                                    <td className="p-3">{record.description} {record.isSimulated && <span className="text-xs text-cyan-500">(Simulação)</span>}</td> 
                                    {showResponsible && (
                                        <td className="p-3 text-gray-300 text-xs">
                                            <span className={`px-2 py-1 rounded-full ${record.responsible === 'Eu' ? 'bg-blue-900/50 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>
                                                {record.responsible || 'Eu'}
                                            </span>
                                        </td>
                                    )}
                                    <td className={`p-3 font-medium text-right ${type === 'income' ? 'text-green-400' : 'text-red-400'}`}> {record.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </td> 
                                    <td className="p-3 text-center"> 
                                        <div className="flex justify-center items-center gap-3"> 
                                            <button onClick={() => onEdit(record, type)} className="p-1 rounded-full hover:bg-blue-800/50 transition-colors"> <icons.EditIcon /> </button> 
                                            <button onClick={() => onDelete(record.id, type)} className="p-1 rounded-full hover:bg-red-800/50 transition-colors"> <icons.TrashIcon /> </button> 
                                        </div> 
                                    </td> 
                                </tr> 
                            ))} 
                        </tbody> 
                    </table> 
                </div> 
            ) : ( 
                <p className="text-gray-500 text-center py-4">Nenhum registro encontrado.</p> 
            )} 
        </div> 
    );
};

window.RecordsTable = RecordsTable;
