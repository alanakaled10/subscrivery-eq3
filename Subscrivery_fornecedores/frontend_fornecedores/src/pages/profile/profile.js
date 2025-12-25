import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import logoImg from '../../assets/logo.png';
import '../Dashboard/dashboard.css';
import './profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [fornecedor, setFornecedor] = useState({
    nome_fantasia: '', razao_social: '', cnpj: '', status: '', foto_url: ''
  });
  const [usuario, setUsuario] = useState({ nome: '', foto: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSenhaModal, setShowSenhaModal] = useState(false);
  const [senhas, setSenhas] = useState({ atual: '', nova: '', confirma: '' });

  const buscarDados = async () => {
    try {
      const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));
      if (sessao?.id) {
        setUsuario(sessao);
        const response = await api.get(`/fornecedores/perfil/${sessao.id}`);
        setFornecedor(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { buscarDados(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return alert("Arquivo muito grande. Limite de 2MB.");
      }

      const reader = new FileReader();
      reader.readAsDataURL(file); // Converte para string Base64
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          // Atualiza no Banco de Dados
          await api.put(`/fornecedores/perfil/${fornecedor.id_fornecedor}`, {
            ...fornecedor,
            foto_url: base64data
          });

          setFornecedor(prev => ({ ...prev, foto_url: base64data }));

          // Atualiza a Sessão para o Header
          const novaSessao = { ...usuario, foto: base64data };
          localStorage.setItem('usuarioLogado', JSON.stringify(novaSessao));
          setUsuario(novaSessao);

          alert("Identidade Visual atualizada!");
        } catch (error) {
          alert("Erro ao salvar imagem. Verifique o LONGTEXT no banco.");
        }
      };
    }
  };

  const handleSalvar = async () => {
    try {
      await api.put(`/fornecedores/perfil/${fornecedor.id_fornecedor}`, {
        nome_fantasia: fornecedor.nome_fantasia,
        razao_social: fornecedor.razao_social,
        cnpj: fornecedor.cnpj,
        foto_url: fornecedor.foto_url
      });
      const sessaoAtualizada = {
        ...usuario,
        nome: fornecedor.nome_fantasia
      };
      localStorage.setItem('usuarioLogado', JSON.stringify(sessaoAtualizada));
      setUsuario(sessaoAtualizada);

      alert("Informações retificadas com sucesso!");
      setIsEditing(false);
    } catch (error) {
      alert("Erro ao averbar alterações.");
    }
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    if (senhas.nova !== senhas.confirma) return alert("Divergência nas senhas.");
    try {
      await api.patch(`/fornecedores/perfil/${fornecedor.id_fornecedor}/alterar-senha`, {
        senhaAtual: senhas.atual, novaSenha: senhas.nova
      });
      alert("Senha alterada!");
      setShowSenhaModal(false);
      setSenhas({ atual: '', nova: '', confirma: '' });
    } catch (error) {
      alert("Falha na segurança.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  if (loading) return <div className="loading">Consultando autos...</div>;

  return (
    <div className="dashboard-container">
      <header className="top-header" style={{ backgroundColor: '#5a2d82' }}>
        <div className="header-brand"><img src={logoImg} alt="Logo" /><span>subscrivery</span></div>
        <div className="header-user">
          <span className="user-name">{fornecedor.nome_fantasia || usuario.nome}</span>
          <div className="avatar-icon" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {(fornecedor.foto_url || usuario.foto) ? (
              <img src={fornecedor.foto_url || usuario.foto} alt="Header" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar desktop-only">
          <nav className="sidebar-nav">
            <ul>
              <li><Link to="/dashboard"><i className="fas fa-chart-line"></i> Dashboard</Link></li>
              <li><Link to="/pedidos"><i className="fas fa-box"></i> Pedidos</Link></li>
              <li><Link to="/produtos"><i className="fas fa-box-open"></i> Produtos</Link></li>
              <li><Link to="/relatorios"><i className="fas fa-file-alt"></i> Relatórios</Link></li>
              <li className="active"><Link to="/profile"><i className="fas fa-user-circle"></i> Perfil</Link></li>
              <li onClick={handleLogout} style={{ cursor: 'pointer', color: '#ef4444' }}>
                <i className="fas fa-sign-out-alt"></i> Sair
              </li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="profile-layout-grid">
            <div className="profile-card identity-card">
              <div className="avatar-wrapper" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                <div className="avatar-circle">
                  {fornecedor.foto_url ? (
                    <img src={fornecedor.foto_url} alt="Perfil" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-camera"></i>
                  )}
                </div>
                <input type="file" id="fileInput" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              </div>
              <h2 className="profile-name">{fornecedor.nome_fantasia}</h2>
              <span className="profile-badge">Administrador Master</span>
              <p className="profile-subtext">ID: #{fornecedor.id_fornecedor}</p>
              <button onClick={() => setShowSenhaModal(true)} className="btn-encerrar" style={{ color: '#5a2d82', borderColor: '#5a2d82', marginBottom: '10px' }}>
                Alterar Senha
              </button>
              <button onClick={handleLogout} className="btn-encerrar">Encerrar Sessão</button>
            </div>

            <div className="profile-details-column">
              <div className="profile-card info-section">
                <div className="section-header">
                  <h3>Dados da Razão Social</h3>
                  {!isEditing ? (
                    <button className="btn-edit-profile" onClick={() => setIsEditing(true)}><i className="fas fa-edit"></i> Editar</button>
                  ) : (
                    <div className="btn-group-edit">
                      <button className="btn-save-profile" onClick={handleSalvar}>Salvar</button>
                      <button className="btn-cancel-profile" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                  )}
                </div>

                <div className="inputs-grid">
                  <div className="input-field">
                    <label>Razão Social</label>
                    <input type="text" value={fornecedor.razao_social} readOnly={!isEditing} onChange={e => setFornecedor({ ...fornecedor, razao_social: e.target.value })} className={isEditing ? "edit-mode" : ""} />
                  </div>
                  <div className="input-field">
                    <label>Nome Fantasia</label>
                    <input type="text" value={fornecedor.nome_fantasia} readOnly={!isEditing} onChange={e => setFornecedor({ ...fornecedor, nome_fantasia: e.target.value })} className={isEditing ? "edit-mode" : ""} />
                  </div>
                  <div className="input-field">
                    <label>CNPJ</label>
                    <input type="text" value={fornecedor.cnpj} readOnly={!isEditing} onChange={e => setFornecedor({ ...fornecedor, cnpj: e.target.value })} className={isEditing ? "edit-mode" : ""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showSenhaModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Alterar Senha</h3>
            <form onSubmit={handleAlterarSenha}>
              <div className="input-field">
                <label>Senha Atual</label>
                <input type="password" required value={senhas.atual} onChange={e => setSenhas({ ...senhas, atual: e.target.value })} />
              </div>
              <div className="input-field">
                <label>Nova Senha</label>
                <input type="password" required value={senhas.nova} onChange={e => setSenhas({ ...senhas, nova: e.target.value })} />
              </div>
              <div className="input-field">
                <label>Confirmar Nova Senha</label>
                <input type="password" required value={senhas.confirma} onChange={e => setSenhas({ ...senhas, confirma: e.target.value })} />
              </div>
              <div className="btn-group-edit">
                <button type="submit" className="btn-save-profile">Confirmar</button>
                <button type="button" className="btn-cancel-profile" onClick={() => setShowSenhaModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav className="mobile-tab-bar mobile-only">
        <Link to="/dashboard" className="tab-item"><i className="fas fa-chart-line"></i><span>Dashboard</span></Link>
        <Link to="/pedidos" className="tab-item "><i className="fas fa-solid fa-dolly"></i><span>Pedidos</span></Link>
        <Link to="/produtos" className="tab-item"><i className="fas fa-box"></i><span>Produtos</span></Link>
        <Link to="/relatorios" className="tab-item"><i className="fas fa-file-alt"></i><span>Relatórios</span></Link>
        <Link to="/profile" className="tab-item active"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
};

export default Profile;