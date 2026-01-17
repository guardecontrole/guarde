const EditModal = ({ record, onSave, onCancel, onError, participants }) => { 
    const { useState } = React;
    const [newDescription, setNewDescription] = useState(record.description); 
    const [newAmount, setNewAmount] = useState(record.amount); 
    const [newResponsible, setNewResponsible] = useState(record.responsible || (participants && participants[0]) || 'Eu');
    
    const handleSave = () => { 
        if (!newDescription.trim() || newAmount === '' || newAmount === null || isNaN(parseFloat(newAmount))) { 
            onError("Por favor, preencha a descrição e um valor válido."); 
            return; 
        } 
        onSave(record.id, record.type, { 
            ...record, 
            description: newDescription, 
            amount: parseFloat(newAmount),
            responsible: newResponsible
        }); 
    }; 
    
    const showResponsible = participants && participants.length > 1;

    return ( 
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"> 
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"> 
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Editar Registro</h2> 
                <div className="space-y-4"> 
                    <div> 
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-400 mb-1">Descrição</label> 
                        <input id="edit-description" type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> 
                    </div> 
                    {showResponsible && (
                        <div>
                            <label htmlFor="edit-responsible" className="block text-sm font-medium text-gray-400 mb-1">Responsável</label>
                            <select 
                                id="edit-responsible" 
                                value={newResponsible} 
                                onChange={(e) => setNewResponsible(e.target.value)} 
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {participants.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    )}
                    <div> 
                        <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-400 mb-1">Valor (R$)</label> 
                        <input id="edit-amount" type="number" step="0.01" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> 
                    </div> 
                </div> 
                <div className="mt-6 flex justify-end gap-4"> 
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">Cancelar</button> 
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors">Salvar</button> 
                </div> 
            </div> 
        </div> 
    ); 
};

window.EditModal = EditModal;
