const useSortableData = (items, config) => { 
    const { useMemo } = React;
    return useMemo(() => { 
        if (!config) return items; 
        const sortedItems = [...items]; 
        sortedItems.sort((a, b) => { 
            if (a[config.key] < b[config.key]) { return config.direction === 'ascending' ? -1 : 1; } 
            if (a[config.key] > b[config.key]) { return config.direction === 'ascending' ? 1 : -1; } 
            return 0; 
        }); 
        return sortedItems; 
    }, [items, config]); 
};

window.useSortableData = useSortableData;
