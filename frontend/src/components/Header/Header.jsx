import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import "./Header.css"

export default function Header(value) {
    return(
        <header>
            <input 
                type="text"
                placeholder="Pesquisar"
            />
        </header>
    )
}