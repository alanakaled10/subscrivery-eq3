import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import './profile.css';
import '../Dashboard/dashboard.css';
import logoImg from '../../assets/logo.png';

const Profile = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: 'Ivone Santana' });
  const [fornecedor, setFornecedor] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  useEffect(() => {
    const buscarDadosFornecedor = async () => {
      try {
        const dadosStorage = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (dadosStorage) {
          setUsuario(dadosStorage);
          // Chamada para a rota que configuramos no Backend
          const response = await api.get(`/fornecedores/perfil/${dadosStorage.id}`);
          setFornecedor(response.data);
        }
      } catch (error) {
        console.error("Erro na instrução processual (busca no banco):", error);
      } finally {
        setLoading(false);
      }
    };
    buscarDadosFornecedor();
  }, []);

  if (loading) return <div className="loading">Consultando registros...</div>;

  return (
    <div className="dashboard-container">
      <header className="top-header">
        <div className="header-brand">
          <img src={logoImg} alt="Logo" />
          <span>subscrivery</span>
        </div>
        <div className="header-actions">
          <div className="header-icons desktop-only">
            <span className="icon-item"><i className="fas fa-bell"></i></span>
            <span className="icon-item"><i className="fas fa-cog"></i></span>
          </div>
          <Link to="/profile" className="header-user-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="header-user">
              <span className="user-name">{fornecedor?.nome_fantasia || usuario.nome}</span>
              <div className="avatar-icon"><i className="fas fa-user"></i></div>
            </div>
          </Link>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar desktop-only">
          <nav className="sidebar-nav">
            <ul>
              <li><Link to="/dashboard"><i className="fas fa-chart-line"></i> Dashboard</Link></li>
              <li><i className="fas fa-box"></i> Pedidos</li>
              <li><i className="fas fa-truck"></i> Entregas</li>
              <li><i className="fas fa-users"></i> Clientes</li>
              <li><i className="fas fa-file-alt"></i> Relatórios</li>
              <li className="active"><Link to="/profile"><i className="fas fa-user-circle"></i> Perfil</Link></li>
              <li onClick={handleLogout} style={{ cursor: 'pointer', marginTop: '20px', color: '#ff7675' }}>
                <i className="fas fa-sign-out-alt"></i> Sair
              </li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="profile-layout" style={{ display: 'flex', gap: '25px' }}>
            <div className="profile-card identity-card">
              <div className="avatar-wrapper">
                <div className="avatar-circle"><i className="fas fa-camera"></i></div>
              </div>
              <h2 className="profile-name">{fornecedor?.nome_fantasia || usuario.nome}</h2>
              <span className="profile-badge">Administrador Master</span>
              <p className="profile-subtext">ID do Fornecedor: #{fornecedor?.id_fornecedor || 'N/A'}</p>
              <p className="profile-subtext">CNPJ: {fornecedor?.cnpj || 'Não informado'}</p>
              <button onClick={handleLogout} className="btn-outline" style={{ marginTop: '20px', width: '100%', borderColor: '#ff7675', color: '#ff7675' }}>
                Encerrar Sessão
              </button>
            </div>

            <div className="profile-details" style={{ flex: 1 }}>
              <div className="profile-card info-section">
                <div className="section-header">
                  <h3>Informações da Razão Social</h3>
                  <button className="btn-edit"><i className="fas fa-edit"></i> Editar</button>
                </div>
                <div className="input-field">
                  <label>Razão Social</label>
                  <input type="text" value={fornecedor?.razao_social || ''} readOnly />
                </div>
                <div className="input-field">
                  <label>Nome Fantasia</label>
                  <input type="text" value={fornecedor?.nome_fantasia || ''} readOnly />
                </div>
                <div className="input-field">
                  <label>Status da Conta</label>
                  <input
                    type="text"
                    value={fornecedor?.status?.toUpperCase() || 'ATIVO'}
                    className={fornecedor?.status === 'ativo' ? 'status-ativo' : 'status-inativo'}
                    readOnly
                  />
                </div>
              </div>

              <div className="profile-card security-section" style={{ marginTop: '20px' }}>
                <div className="section-header">
                  <h3>Segurança e Credenciais</h3>
                  <button className="btn-outline">Alterar Senha</button>
                </div>
                <div className="input-field">
                  <label>CNPJ Vinculado (Chave Única)</label>
                  <input type="text" value={fornecedor?.cnpj || ''} readOnly />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <nav className="mobile-tab-bar mobile-only">
        <Link to="/dashboard" className="tab-item"><i className="fas fa-chart-line"></i><span>Início</span></Link>
        <div className="tab-item"><i className="fas fa-box"></i><span>Pedidos</span></div>
        <div className="tab-item" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i><span>Sair</span></div>
        <Link to="/profile" className="tab-item active"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
};

export default Profile;