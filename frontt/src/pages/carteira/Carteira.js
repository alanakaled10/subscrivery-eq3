import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaHistory, FaArrowLeft, FaUser, FaBox, FaShoppingCart, FaHome } from 'react-icons/fa';
import Header from '../../components/Header';
import api from '../../services/api';
import './Carteira.css';

const Carteira = () => {
    const navigate = useNavigate();
    const [dadosCarteira, setDadosCarteira] = useState({
        saldo: 0,
        limite_plano: 0,
        proxima_renovacao: ''
    });
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
             
                const idUsuario = localStorage.getItem('id_usuario');
                
                if (!idUsuario) {
                    console.error("Jurisdicionado não autenticado.");
                    return;
                }

                const [resStatus, resHistorico] = await Promise.all([
                    api.get(`/auth/carteira/status/${idUsuario}`),
                    api.get(`/auth/carteira/historico/${idUsuario}`)
                ]);

                // Alimentação do Estado com base na Verdade Real dos dados do servidor
                setDadosCarteira({
                    saldo: resStatus.data.saldo_atual,
                    limite_plano: resStatus.data.limite_plano,
                    proxima_renovacao: resStatus.data.proxima_entrega
                });

                setHistorico(resHistorico.data);
            } catch (error) {
                console.error("Erro na instrução do saldo dinâmico:", error);
            } finally {
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    if (loading) return null;

    // JURIDICAMENTE: A isenção de frete é uma vantagem acessória vinculada à adimplência e saldo
    const temCredito = dadosCarteira.saldo > 0;

    return (
        <div className="home-wrapper">
            <div className="home-layout">
                <aside className="sidebar-desktop">
                    <div className="sidebar-logo">Subscrivery</div>
                    <nav>
                        <button onClick={() => navigate('/home')}><FaHome /> Início</button>
                        <button onClick={() => navigate('/carrinho')}><FaShoppingCart /> Carrinho</button>
                        <button onClick={() => navigate('/pedidos')}><FaBox /> Meus Pedidos</button>
                        <button className="active" onClick={() => navigate('/perfil')}><FaUser /> Perfil</button>
                    </nav>
                </aside>

                <main className="home-main">
                    <Header />
                    <div className="home-content">
                        <div className="carteira-content-wrapper">
                            

                            <section className="carteira-header-card">
                                <div className="carteira-icon-main">
                                    <FaWallet />
                                </div>
                                <span>Saldo Disponível</span>
                                
                                <h1>R$ {dadosCarteira.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h1>

                                <div className={`frete-status-badge ${temCredito ? 'active' : 'inactive'}`}>
                                    {temCredito ? "FRETE GRÁTIS ATIVADO" : "FRETE COBRADO À PARTE"}
                                </div>
                            </section>


                            <section className="regras-uso-carteira">
                                <h3>Regras da Carteira</h3>
                                <ul>
                                    <li>Limite Mensal: R$ {dadosCarteira.limite_plano.toFixed(2)}.</li>
                                    <li>Isenção de Frete: Condicionada à existência de saldo.</li>
                                    <li>Exaustão do Saldo: Implica na cobrança onerosa de frete por pedido.</li>
                                    <li>Caducidade: O saldo não consumido se extingue ao final do ciclo (não cumulativo).</li>
                                </ul>
                            </section>

                            <section className="historico-carteira-lista">
                                <h3>Histórico de Movimentações</h3>
                                {historico.length > 0 ? (
                                    historico.map((item) => (
                                        <div key={item.id} className="historico-item">
                                            <div className="historico-info">
                                                <strong>{item.descricao} #{item.id}</strong>
                                                <small>{new Date(item.data).toLocaleDateString('pt-BR')}</small>
                                            </div>
                                            <span className="valor-saida">- R$ {parseFloat(item.valor).toFixed(2)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-state">Nenhum registro de débito localizado no prontuário.</p>
                                )}
                            </section>
                        </div>
                    </div>
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

export default Carteira;