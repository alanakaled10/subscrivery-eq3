import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import '../login/styles.css';
import logoImg from '../../assets/logo.png';

const Cadastro = () => {
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Função para aplicar a máscara de CNPJ (00.000.000/0000-00)
  const handleCnpjChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (value.length > 14) value = value.slice(0, 14); // Limita a 14 dígitos

    // Aplica a formatação progressiva
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');

    setCnpj(value);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      // No banco, geralmente salvamos apenas os números (limpos)
      const cnpjLimpo = cnpj.replace(/\D/g, '');

      const dados = { 
        nome_fantasia: nomeFantasia, 
        razao_social: razaoSocial, 
        cnpj: cnpjLimpo, // Enviamos o dado puro para o banco
        email, 
        senha 
      };

      const response = await api.post('/usuarios', dados);

      if (response.status === 201) {
        alert('Fornecedor cadastrado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      const msgErro = error.response?.data?.error || 'Erro ao conectar com o servidor.';
      alert(msgErro);
    }
  };

  return (
    <div className="login-page">
      <header className="header-purple">
        <h1>
          <img src={logoImg} alt="Subscrivery Logo" className="logo-header" />
          subscrivery
        </h1>
        <p>Sua vida, sem a complicação do mercado.</p>
      </header>

      <main className="login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#111827' }}>
          Criar conta de Parceiro
        </h2>

        <form className="login-form" onSubmit={handleCadastro}>
          <label>Nome Fantasia</label>
          <input
            type="text"
            placeholder="Ex: Padaria do João"
            value={nomeFantasia}
            onChange={(e) => setNomeFantasia(e.target.value)}
            required
          />

          <label>Razão Social</label>
          <input
            type="text"
            placeholder="Ex: João da Silva Panificadora LTDA"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            required
          />

          <label>CNPJ</label>
          <input
            type="text"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={handleCnpjChange} // Usa a função de máscara
            required
          />

          <label>E-mail Profissional</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Crie uma senha forte"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength="8" 
            required
          />

          <button type="submit">Cadastrar</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Já tem uma conta? <Link to="/" style={{ color: '#5a2d82', fontWeight: 'bold', textDecoration: 'none' }}>Faça login.</Link>
        </p>
      </main>
    </div>
  );
};

export default Cadastro;