import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; //
import api from '../../services/api.js'; //
import './styles.css';
import iconeFundo from '../../assets/iconi_fundo.png';
import logoImg from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {

      const response = await api.post('/login', { email, senha });


      if (response.status === 200) {

        localStorage.setItem('usuarioLogado', JSON.stringify(response.data.usuario));
        navigate('/dashboard');
        
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErro('E-mail ou senha incorretos.');
      } else {
        setErro('Erro ao conectar com o servidor. Verifique o backend.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="header-purple">
        <h1><img src={logoImg} alt="Subscrivery Logo" className="logo-header" />  subscrivery</h1>
        <p>Sua vida, sem a complicação do mercado.</p>
      </div>

      <div className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#1F2937' }}>
          Bem-vindo de volta, Parceiro!
        </h2>

        <form className="login-form" onSubmit={handleLogin}>
          <label>E-mail</label>
          <input
            type="email"
            placeholder="Seu e-mail profissional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />


          {erro && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>
              {erro}
            </p>
          )}

          <button type="submit">Entrar no Portal</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="#" style={{ color: '#013D3B', textDecoration: 'none', fontSize: '14px' }}>
            Esqueceu sua senha?
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#4B5563' }}>
            Novo por aqui?{' '}
            <Link to="/cadastro" style={{ color: '#00B894', fontWeight: 'bold', textDecoration: 'none' }}>
              Crie sua conta.
            </Link>
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default Login;