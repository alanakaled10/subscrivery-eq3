import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import "./Header.css"

export default function Header() {
    const {logout} = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return(
        <header>
            <strong>Subscrivery</strong>

            <button onClick={handleLogout}> Logout </button>
        </header>
    )
}