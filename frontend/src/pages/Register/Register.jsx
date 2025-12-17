import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

import "./Register.css"

export default function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [erro, setErro] = useState("");

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (!nome || !email || !senha || !confirmacao) {
            setErro("Preencha todos os campos");
            return;
        }

        if (senha !== confirmacao) {
            setErro("As senhas não conferem");
            return;
        }

        navigate("/login");
    }

    return (
        <div className="register-container">

            <form onSubmit={handleSubmit}>
                <h1>Cadastro</h1>

                {erro && <p className="error">{erro}</p>}

                <Input
                    label="Nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

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

                <Input
                    label="Confirmar senha"
                    type="password"
                    value={confirmacao}
                    onChange={(e) => setConfirmacao(e.target.value)}
                />

                <Button type="submit">cadastrar</Button>

                <p>
                    Já tem conta? <Link to="/Login">Login</Link>
                </p>
            </form>
        </div>
    )
}