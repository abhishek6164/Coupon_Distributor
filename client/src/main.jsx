import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct for React 18
import App from "./App";
import { AppContextProvider } from "./components/context/AppContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>
);
