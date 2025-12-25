import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import Input from "../../components/Input/Input";
import "./ResetPassword.css";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!password || password.length < 8) {
            setError("A senha deve ter no mínimo 8 caracteres");
            return;
        }

        if (!token) {
            setError("Token inválido ou expirado");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await axios.post("http://localhost:3000/auth/redefinir-senha", {
                token,
                novaSenha: password,
            });

            setSuccess(true);
        } catch (err) {
            setError("Não foi possível redefinir a senha");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="reset-password-container">
            <header className="login-header">
                <button className="back-btn">
                    ←
                </button>
                <span>Login</span>
                <button className="help-btn">?</button>
            </header>

            {!success ? (
                <form onSubmit={handleSubmit}>
                    <Input
                        type="password"
                        placeholder="Nova senha"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                    />

                    {error && <span className="error">{error}</span>}

                    <button className="btn-primary" disabled={loading}>
                        {loading ? "Salvando..." : "Redefinir senha"}
                    </button>
                </form>
            ) : (
                <>
                    <p className="success">
                        Senha redefinida com sucesso!
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/login")}
                    >
                        Ir para login
                    </button>
                </>
            )}
        </div>
    )
}