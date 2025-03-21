import { createContext } from "react";

export const AppContext = createContext(); // Fixed name (AppContext instead of AppContent)

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <AppContext.Provider value={{ backendUrl }}>{children}</AppContext.Provider>
  );
};
