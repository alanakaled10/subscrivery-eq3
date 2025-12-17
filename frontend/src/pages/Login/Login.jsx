import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from "react-router-dom";
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import "./Login.css"

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (!email || !senha) {
            setErro("Preencha todos os campos");
            return;
        }

        login();
        navigate('/plans');
    }

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>

                {erro && <p className='error'>{erro}</p>}

                <Input
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <Button type="submit">Entrar</Button>

                <p>
                    Não tem conta? <Link to="/register">Cadastre-se</Link>
                </p>
            </form>
        </div>
    );
}