import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    cpf: '',
    telefone: '',
    senha_hash: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/cadastro', formData);
    
    if (response.status === 201) {
    
      localStorage.setItem('id_usuario', response.data.id_usuario);
      navigate('/planos');
    }
  } catch (error) {
    alert(error.response?.data?.error || "Erro ao conectar com o servidor.");
  }
};

  

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h2 className="cadastro-title">Crie sua conta</h2>
        <p className="cadastro-subtitle">Preencha os dados para continuar</p>

        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="input-group">
            <label>Nome Completo</label>
            <input type="text" name="nome_completo" placeholder="Digite seu nome completo" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>E-mail</label>
            <input type="email" name="email" placeholder="seu@email.com" onChange={handleChange} required />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>CPF</label>
              <input type="text" name="cpf" placeholder="000.000.000-00" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Telefone</label>
              <input type="text" name="telefone" placeholder="(00) 00000-0000" onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input type="password" name="senha_hash" placeholder="Crie uma senha forte" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-proximo">
            Próximo: Escolher Plano
          </button>
        </form>

        <p className="footer-text">
          Já tem uma conta? <span onClick={() => navigate('/login')}>Faça login</span>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;