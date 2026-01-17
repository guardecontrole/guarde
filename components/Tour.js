const Tour = ({ steps, isOpen, onClose }) => { 
    const { useState, useEffect } = React; 
    const [currentStepIndex, setCurrentStepIndex] = useState(0); 
    const [style, setStyle] = useState({}); 

    useEffect(() => { 
        if (!isOpen) return; 
        const currentStep = steps[currentStepIndex]; 
        const targetElement = document.querySelector(currentStep.target); 
        if (targetElement) { 
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
            const targetRect = targetElement.getBoundingClientRect(); 
            targetElement.classList.add('tour-highlight'); 
            const popoverStyle = { 
                position: 'absolute', 
                top: `${targetRect.bottom + window.scrollY + 10}px`, 
                left: `${targetRect.left + window.scrollX}px`, 
                maxWidth: '350px', 
                transform: 'translateX(0)', 
            }; 
            if (targetRect.left + 350 > window.innerWidth) { 
                popoverStyle.left = `${targetRect.right + window.scrollX - 350}px`; 
            } 
            if (targetRect.top < 200) { 
                popoverStyle.top = `${targetRect.bottom + window.scrollY + 10}px`; 
            } else { 
                popoverStyle.top = `${targetRect.top + window.scrollY - 10}px`; 
                popoverStyle.transform = 'translateY(-100%)'; 
            } 
            setStyle(popoverStyle); 
        } else { 
            setStyle({ 
                position: 'fixed', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                maxWidth: '350px', 
            }); 
        } 
        return () => { 
            if (targetElement) { 
                targetElement.classList.remove('tour-highlight'); 
            } 
        }; 
    }, [currentStepIndex, isOpen, steps]); 

    if (!isOpen) return null; 

    const handleNext = () => currentStepIndex < steps.length - 1 ? setCurrentStepIndex(currentStepIndex + 1) : onClose(); 
    const handlePrev = () => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1); 
    const currentStep = steps[currentStepIndex]; 

    return ( 
        <> 
            <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose}></div> 
            <div style={style} className="bg-gray-700 text-gray-200 rounded-lg shadow-2xl p-5 z-50 transition-all duration-300"> 
                <h3 className="text-xl font-bold text-blue-400 mb-2">{currentStep.title}</h3> 
                <p className="text-sm mb-4">{currentStep.content}</p> 
                <div className="flex justify-between items-center"> 
                    <span className="text-xs text-gray-400">Passo {currentStepIndex + 1} de {steps.length}</span> 
                    <div className="flex gap-2"> 
                        <button onClick={onClose} className="text-xs px-3 py-1 rounded hover:bg-gray-600 transition-colors">Pular</button> 
                        {currentStepIndex > 0 && <button onClick={handlePrev} className="px-4 py-1 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">Anterior</button>} 
                        <button onClick={handleNext} className="px-4 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"> {currentStepIndex === steps.length - 1 ? 'Concluir' : 'Próximo'} </button> 
                    </div> 
                </div> 
            </div> 
        </> 
    ); 
}; 

window.Tour = Tour;
