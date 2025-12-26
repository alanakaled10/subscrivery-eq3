import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export default function Register() {
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");

  function handleNext() {
    setError("");

    if (step === 1) {
      if (!email) {
        setError("Informe seu e-mail");
        return;
      }

      if (!emailRegex.test(email)) {
        setError("Informe um e-mail válido");
        return;
      }
    }

    if (step === 2 && !phone) {
      setError("Informe seu celular");
      return;
    }

    if (step === 3 && password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    setStep(step + 1);
  }

  async function handleRegister() {
    if (!name || !lastName) {
      setError("Preencha seu nome completo");
      return;
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos");
      return;
    }

    try {
      const nome_completo = `${name} ${lastName}`;
      const resposta = await axios.post('http://localhost:3000/usuarios', {
        nome_completo: nome_completo,
        email: email,
        senha: password,
        telefone: phone,
        cpf: null 
      });

      alert(resposta.data.mensagem);
      navigate("/plans");

    } catch (err) {
      
      setError(err.response?.data?.erro || "Erro ao conectar com o servidor");
    }
  }

  function handleBack() {
    if (step === 1) {
      navigate("/");
    } else {
      setStep(step - 1);
      setError("");
    }
  }

  return (
    <div className="register-container">
      <header className="register-header">
        <button className="back-btn" onClick={handleBack}>
          ←
        </button>
        <span>Cadastro</span>
        <div></div>
      </header>

      {step === 1 && (
        <div className="register-container">
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
        <div className="register-container">
          <div className="container">

            <h1>Qual é seu celular?</h1>

            <Input
              type="tel"
              placeholder="Celular"
              value={phone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setPhone(onlyNumbers);
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

      {step === 3 && (
        <div className="register-container">
          <div className="container">

            <h1>Agora, escolha uma senha</h1>
            <p className="subtitle">Mínimo de 8 caracteres</p>

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
          </div>

          <Button className="btn-primary" onClick={handleNext}>
            Continuar
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="register-container">
          <div className="container">

            <h1>Detalhes da conta</h1>

            <Input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />

            <Input
              type="text"
              placeholder="Sobrenome"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setError("");
              }}
            />

            <Input type="email" value={email} disabled />

            <div class="terms-container">
              <div className="container">
                <Input
                  type="checkbox"
                  className="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
              </div>

              <span class="text">
                Concordo com os <a href="#" target="_blank">Termos & Condições</a> e a <a href="#" target="_blank">Política de Privacidade</a>
              </span>
            </div>

            {error && <span className="error">{error}</span>}
          </div>

          <Button className="btn-primary" onClick={handleRegister}>
            Criar minha conta
          </Button>
        </div>
      )
      }
    </div >
  );
}
