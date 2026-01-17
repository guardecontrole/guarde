const SortIndicator = ({ sortConfig, columnKey }) => { 
    const icons = window.icons;
    if (sortConfig.key === columnKey) { 
        return sortConfig.direction === 'ascending' ? <icons.SortAscIcon /> : <icons.SortDescIcon />; 
    } 
    return <icons.NeutralSortIcon />; 
};

window.SortIndicator = SortIndicator;
