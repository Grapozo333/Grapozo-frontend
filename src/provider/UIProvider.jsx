import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [showSearchBar, setShowSearchBar] = useState(true);
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    const value = {
        showSearchBar,
        setShowSearchBar,
        breadcrumbs,
        setBreadcrumbs,
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}; 