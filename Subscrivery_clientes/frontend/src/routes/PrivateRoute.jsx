import { Navigate } from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

export function PrivateRoute({children}) {
    const { estaLogado } = useAuth();

    if (!estaLogado) {
        return <Navigate to="/login" replace />;
    }

    return children;
}