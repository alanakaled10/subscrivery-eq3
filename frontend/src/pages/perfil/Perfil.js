import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserCircle, FaHome, FaBox, FaShoppingCart, FaWallet, FaHeart, FaTicketAlt,
    FaChevronRight, FaMapMarkerAlt, FaCreditCard, FaBell, FaCrown, FaSignOutAlt, FaUser, FaArrowLeft
} from 'react-icons/fa';
import Header from '../../components/Header';
import api from '../../services/api';
import './Perfil.css';

const Perfil = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ nome: '', email: '', id_plano: null });
    const [loading, setLoading] = useState(true);

    const carregarPerfil = async () => {
        try {
            const idUsuario = localStorage.getItem('id_usuario');
            const res = await api.get(`/auth/perfil/${idUsuario}`);
            setUsuario({
                nome: res.data.nome_completo,
                email: res.data.email,
                id_plano: String(res.data.id_plano)
            });
            localStorage.setItem('id_plano', res.data.id_plano);
        } catch (error) {
            setUsuario({
                nome: localStorage.getItem('nome_usuario') || 'Usuário',
                email: localStorage.getItem('email_usuario') || 'usuario@email.com',
                id_plano: String(localStorage.getItem('id_plano') || '4')
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarPerfil(); }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="perfil-page-container">
                <Header />
                <div className="loading-container">Carregando dados...</div>
            </div>
        );
    }

    const isFree = usuario.id_plano === '4';

    return (
        <div className="perfil-page-container">
            <Header />

            <div className="dashboard-layout">
                <aside className="sidebar-white">
                  
                    <button className="btn-back-home desktop-only" onClick={() => navigate('/home')}>
                        <FaArrowLeft /> Voltar ao Início
                    </button>

                    <div className="sidebar-profile-box">
                        <FaUserCircle className="sidebar-avatar-icon" />
                        <h2>{usuario.nome}</h2>
                        <p>{usuario.email}</p>
                        <span className={`plan-tag ${isFree ? 'free' : 'premium'}`}>
                            {isFree ? 'Plano Free' : 'Assinante Premium'}
                        </span>

                        <button className="btn-logout-sidebar" onClick={handleLogout}>
                            <FaSignOutAlt /> Sair da conta
                        </button>
                    </div>
                </aside>

                <main className="dashboard-main-content">
                    <section className="overview-row">


                        <div className="overview-item" onClick={() => navigate('/carteira')}>
                            <div className="icon-circle-purple"><FaWallet /></div>
                            <span>Carteira</span>
                        </div>

                        <div className="overview-item">
                            <div className="icon-circle-purple"><FaHeart /></div>
                            <span>Favoritos</span>
                        </div>

                        {!isFree && (
                            <div className="overview-item">
                                <div className="icon-circle-purple"><FaTicketAlt /></div>
                                <span>Cupons</span>
                            </div>
                        )}
                    </section>

                    <section className="account-grid-section">
                        <h3>Minha Conta</h3>
                        <div className="management-grid">
                            <div className="manage-card" onClick={() => navigate('/dados-conta')}>
                                <div className="manage-card-left">
                                    <div className="manage-icon-purple"><FaUserCircle /></div>
                                    <div className="manage-text">
                                        <h4>Dados da Conta</h4>
                                        <span>Gerencie seus dados e assinatura</span>
                                    </div>
                                </div>
                                <FaChevronRight className="arrow-next" />
                            </div>

                            <div className="manage-card" onClick={() => navigate('/enderecos')}>
                                <div className="manage-card-left">
                                    <div className="manage-icon-purple"><FaMapMarkerAlt /></div>
                                    <div className="manage-text">
                                        <h4>Endereços</h4>
                                        <span>Meus endereços de entrega</span>
                                    </div>
                                </div>
                                <FaChevronRight className="arrow-next" />
                            </div>

                            <div className="manage-card" onClick={() => navigate('/cartoes')}>
                                <div className="manage-card-left">
                                    <div className="manage-icon-purple"><FaCreditCard /></div>
                                    <div className="manage-text">
                                        <h4>Cartões</h4>
                                        <span>Gerencie formas de pagamento</span>
                                    </div>
                                </div>
                                <FaChevronRight className="arrow-next" />
                            </div>

                            <div className="manage-card">
                                <div className="manage-card-left">
                                    <div className="manage-icon-purple"><FaBell /></div>
                                    <div className="manage-text">
                                        <h4>Notificações</h4>
                                        <span>Central de mensagens</span>
                                    </div>
                                </div>
                                <FaChevronRight className="arrow-next" />
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <nav className="bottom-nav-mobile">
                <button onClick={() => navigate('/home')}><FaHome /> <small>Home</small></button>
                <button onClick={() => navigate('/carrinho')}><FaShoppingCart /> <small>Carrinho</small></button>
                <button onClick={() => navigate('/pedidos')}><FaBox /> <small>Pedidos</small></button>
                <button className="active" onClick={() => navigate('/perfil')}><FaUser /> <small>Perfil</small></button>
            </nav>
        </div>
    );
};

export default Perfil;