import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [estaLogado, setEstaLogado] = useState(false);

    function login() {
        setEstaLogado(true);
    }

    function logout() {
        setEstaLogado(false);
    }

    return (
        <AuthContext.Provider value ={{ estaLogado, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}