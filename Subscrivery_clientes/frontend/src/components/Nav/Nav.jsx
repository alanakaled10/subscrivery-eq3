import {NavLink} from "react-router-dom";
import "./Nav.css"

export default function Nav() {
    return(
        <nav className="bottom-nav">
            <NavLink to="/conta" className="nav-item">
                icone
                <span>Conta</span>
            </NavLink>
            <NavLink to="/dashboard" className="nav-item">
                icone
                <span>Início</span>
            </NavLink>
            <NavLink to="/carrinho" className="nav-item">
                icone
                <span>Carrinho</span>
            </NavLink>
            <NavLink to="/menu" className="nav-item">
                icone
                <span>Menu</span>
            </NavLink>
        </nav>
    )
}