import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaHome, FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import Header from '../../components/Header';
import api from '../../services/api';
import './Pedidos.css';

const Pedidos = () => {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const idUsuario = localStorage.getItem('id_usuario');

    useEffect(() => {
        const carregarPedidos = async () => {
            try {
                // Tentativa de buscar a "verdade real" no banco de dados
                const res = await api.get(`/auth/pedidos/${idUsuario}`);
                setPedidos(res.data);
            } catch (err) {
                console.error("Falha na busca dos pedidos. Verifique a rota /api/auth/pedidos/:idUsuario.");
            } finally {
                setLoading(false);
            }
        };
        if (idUsuario) carregarPedidos();
        else setLoading(false);
    }, [idUsuario]);

    if (loading) return null;

    return (
        <div className="home-wrapper">
            <div className="home-layout">
                {/* Sidebar Desktop - Unidade Visual */}
                <aside className="sidebar-desktop">
                  
                    <nav>
                        <button onClick={() => navigate('/home')}><FaHome /> Início</button>
                        <button onClick={() => navigate('/carrinho')}><FaShoppingCart /> Carrinho</button>
                        <button className="active" onClick={() => navigate('/pedidos')}><FaBox /> Meus Pedidos</button>
                        <button onClick={() => navigate('/perfil')}><FaUser /> Perfil</button>
                    </nav>
                </aside>

                <main className="home-main">
                    <Header />
                    
                    <div className="home-content">
                        <div className="pedidos-content-wrapper">
                            <h2 className="section-title">Histórico de Pedidos</h2>

                            <div className="pedidos-list">
                                {pedidos.length > 0 ? (
                                    pedidos.map(pedido => (
                                        <div key={pedido.id_pedidos} className="pedido-card">
                                            <div className="pedido-main-info">
                                                <FaBox className="box-icon" />
                                                <div className="details">
                                                    <strong>Pedido #{pedido.id_pedidos}</strong>
                                                    <span>{new Date(pedido.data_compra).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                            </div>
                                            <div className="pedido-financial-info">
                                                <span className={`status-badge ${pedido.status_atual?.toLowerCase().replace(/\s/g, '-')}`}>
                                                    {pedido.status_atual || 'Processando'}
                                                </span>
                                                <span className="valor">R$ {parseFloat(pedido.valor_total).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-pedidos-state">
                                        <FaSearch size={40} />
                                        <p>Nenhum pedido localizado no histórico.</p>
                                        <button className="btn-comprar" onClick={() => navigate('/home')}>Ir às compras</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Nav Mobile */}
            <nav className="bottom-nav-mobile">
                <button onClick={() => navigate('/home')}><FaHome /> <small>Home</small></button>
                <button onClick={() => navigate('/carrinho')}><FaShoppingCart /> <small>Carrinho</small></button>
                <button className="active" onClick={() => navigate('/pedidos')}><FaBox /> <small>Pedidos</small></button>
                <button onClick={() => navigate('/perfil')}><FaUser /> <small>Perfil</small></button>
            </nav>
        </div>
    );
};

export default Pedidos;