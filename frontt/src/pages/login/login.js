import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // O backend agora deve retornar o id_assinatura junto com os dados do usuário
      const response = await api.post('/auth/login', { email, senha });
      
      const { user } = response.data;

      // ARQUIVAMENTO DE PROVAS (LocalStorage)
      // Guardamos o ID do usuário e o Nome para personalização
      localStorage.setItem('id_usuario', user.id);
      localStorage.setItem('nome_usuario', user.nome);
      
      // JURIDICAMENTE: Salvamos o título da assinatura para legitimar compras futuras
      if (user.id_assinatura) {
          localStorage.setItem('id_assinatura', user.id_assinatura);
      } else {
          // Se não houver assinatura, removemos resquícios de sessões anteriores
          localStorage.removeItem('id_assinatura');
      }
      
      navigate('/home');
    } catch (error) {
      // Tratamento de erro com base na resposta do servidor
      const mensagemErro = error.response?.data?.error || "Erro ao realizar login. Verifique suas credenciais.";
      alert(mensagemErro);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-logo">Subscrivery</h1>
        <p className="login-subtitle">Acesse sua conta para gerenciar seus créditos</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-login">Entrar</button>
        </form>

        <p className="login-footer">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;