import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAuthProvider } from "./user/context/UserAuthContext";

import "./assets/styles/global.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserAuthProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </UserAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
