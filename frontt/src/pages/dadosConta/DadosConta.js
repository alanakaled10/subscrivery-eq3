import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../services/api';
import './DadosConta.css';
import {
    FaUserCircle, FaHome, FaBox, FaShoppingCart, FaWallet, FaHeart, FaTicketAlt,
    FaChevronRight, FaMapMarkerAlt, FaCreditCard, FaBell, FaCrown, FaSignOutAlt, FaUser
} from 'react-icons/fa';

const DadosConta = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        id_usuario: '',
        nome_completo: '',
        email: '',
        cpf: '',
        telefone: ''
    });
    const [planoAtual, setPlanoAtual] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            const idUsuario = localStorage.getItem('id_usuario');
            try {
                const response = await api.get(`/auth/perfil/${idUsuario}`);

                setUserData({
                    id_usuario: idUsuario,
                    nome_completo: response.data.nome_completo,
                    email: response.data.email,
                    cpf: response.data.cpf || '',
                    telefone: response.data.telefone || ''
                });
                setPlanoAtual({
                    id: response.data.id_plano,
                    nome: response.data.id_plano === 4 ? 'Plano Free' : 'Assinante Premium'
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const idUsuario = localStorage.getItem('id_usuario');

        try {
            await api.put(`/auth/atualizar-dados`, {
                id_usuario: idUsuario,
                nome_completo: userData.nome_completo,
                cpf: userData.cpf.replace(/\D/g, ""),
                telefone: userData.telefone.replace(/\D/g, "")
            });

            alert("Dados atualizados com sucesso!");
        } catch (error) {
            alert("Erro ao atualizar dados.");
        }
    };

    const cancelarAssinatura = async () => {
        if (window.confirm("Deseja realmente cancelar sua assinatura? Você voltará ao plano Avulso (Free).")) {
            try {
                const idUsuario = localStorage.getItem('id_usuario');
                await api.put('/auth/migrar-plano', {
                    idUsuario: idUsuario,
                    idPlano: 4,
                    id_frequencia: null
                });
                alert("Assinatura cancelada.");
                navigate('/perfil');
            } catch (error) {
                alert("Erro ao cancelar.");
            }
        }
    };

    if (loading) return null;

    return (
        <div className="perfil-page-container">
            <Header />
            <div className="dados-conta-container">
                <h2>Minha Conta</h2>

                <form onSubmit={handleUpdate} className="dados-form">
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={userData.nome_completo}
                        onChange={(e) => setUserData({ ...userData, nome_completo: e.target.value })}
                        className="input-editable"
                    />

                    <label>E-mail:</label>
                    <input type="text" value={userData.email} readOnly className="input-readonly" />

                    <label>CPF:</label>
                    <input
                        type="text"
                        value={userData.cpf}
                        onChange={(e) => setUserData({ ...userData, cpf: e.target.value })}
                    />

                    <label>Telefone:</label>
                    <input
                        type="text"
                        value={userData.telefone}
                        onChange={(e) => setUserData({ ...userData, telefone: e.target.value })}
                        className="input-editable"
                        placeholder="Digite seu telefone"
                    />

                    <button type="submit" className="btn-save">Salvar Alterações</button>
                </form>

                <div className="gestao-assinatura">
                    <h3>Sua Assinatura: <span className="plano-tag">{planoAtual?.nome}</span></h3>

                    <div className="acoes-assinatura">
                        <button onClick={() => navigate('/planos')} className="btn-change">
                            Mudar de Plano
                        </button>

                        {planoAtual?.id !== 4 && (
                            <button onClick={cancelarAssinatura} className="btn-cancel">
                                Cancelar Assinatura
                            </button>
                        )}
                    </div>
                </div>
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

export default DadosConta;