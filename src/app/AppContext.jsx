import React from "react";
export const AppContext = React.createContext(null);
export function useApp() { return React.useContext(AppContext); }
