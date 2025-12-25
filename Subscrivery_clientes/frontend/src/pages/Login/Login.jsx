import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import "./Login.css";

export default function Login() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    // ... dentro do componente Login
    async function handleLogin(e) {
        e.preventDefault();

        if (!password) {
            setError("Informe sua senha");
            return;
        }

        try {

            const resposta = await axios.post('http://localhost:3000/auth/login', {
                email: email,
                senha: password
            });

            setError("");
            login(resposta.data.usuario);
            alert(resposta.data.mensagem);
            navigate("/plans");

        } catch (err) {

            setError(err.response?.data?.erro || "Erro ao conectar com o servidor");
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        if (!email) {
            setError("Informe seu e-mail no primeiro passo antes de recuperar a senha.");
            setStep(1);
            return;
        }

        try {
            const resposta = await axios.post('http://localhost:3000/auth/esqueci-senha', {
                email: email
            });
            alert(resposta.data.mensagem);
        } catch (err) {
            setError(err.response?.data?.erro || "Erro ao processar solicitação");
        }
    }

    function handleNext(e) {
        e.preventDefault();

        if (!email) {
            setError("Informe seu e-mail");
            return;
        }

        setError("");
        setStep(2);
    }


    function handleBack() {
        if (step === 1) {
            navigate("/");
        } else {
            setStep(1);
            setError("");
        }
    }

    return (
        <div className="login-container">
            <header className="login-header">
                <button className="back-btn" onClick={handleBack}>
                    ←
                </button>
                <span>Login</span>
                <button className="help-btn">?</button>
            </header>

            {step === 1 && (
                <div className="login-container">
                    <div className="container">

                        <h1>Qual é seu e-mail?</h1>

                        <Input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                        />

                        {error && <span className="error">{error}</span>}
                    </div>

                    <Button className="btn-primary" onClick={handleNext}>
                        Continuar
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="login-container">
                    <div className="container">

                        <h1>Sua senha</h1>

                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                        />

                        {error && <span className="error">{error}</span>}

                        <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                            Esqueci minha senha
                        </a>
                    </div>

                    <Button className="btn-primary" onClick={handleLogin}>
                        Continuar
                    </Button>
                </div>
            )}
        </div>
    );
}
