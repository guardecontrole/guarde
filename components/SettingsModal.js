const SettingsModal = ({ isOpen, onClose, participants, onSaveParticipants }) => {
    const { useState, useEffect } = React;
    const [tempParticipants, setTempParticipants] = useState(participants || ['Eu']);
    const [newParticipant, setNewParticipant] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTempParticipants(participants || ['Eu']);
            setNewParticipant('');
        }
    }, [isOpen, participants]);

    const handleAdd = () => {
        if (newParticipant.trim() && !tempParticipants.includes(newParticipant.trim())) {
            setTempParticipants([...tempParticipants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    const handleRemove = (index) => {
        if (tempParticipants.length > 1) {
            const newList = tempParticipants.filter((_, i) => i !== index);
            setTempParticipants(newList);
        } else {
            alert("É necessário ter pelo menos um participante.");
        }
    };

    const handleSave = () => {
        onSaveParticipants(tempParticipants);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Configurações</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Participantes</label>
                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                            {tempParticipants.map((p, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                                    <span>{p}</span>
                                    <button onClick={() => handleRemove(index)} className="text-red-400 hover:text-red-300">
                                        <window.icons.TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newParticipant} 
                                onChange={(e) => setNewParticipant(e.target.value)} 
                                placeholder="Nome"
                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 font-bold">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.SettingsModal = SettingsModal;
