import React, { useState, useEffect } from 'react';
import { FaTrash, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importado para redirecionamento
import api from '../../services/api';
import './Carrinho.css';

const Carrinho = () => {
    const [itens, setItens] = useState([]);
    const navigate = useNavigate(); // Hook para navegação entre rotas
    const idUsuario = localStorage.getItem('id_usuario');

    useEffect(() => {
        const carregarCarrinho = async () => {
            try {
                const res = await api.get(`/carrinho/${idUsuario}`);
                setItens(res.data);
            } catch (err) {
                console.error("Erro ao carregar memorial do pedido.");
            }
        };
        if (idUsuario) carregarCarrinho();
    }, [idUsuario]);

    const calcularTotal = () => itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    const removerItem = async (idProduto) => {
        try {
            await api.delete(`/carrinho/${idUsuario}/${idProduto}`);
            setItens(itens.filter(item => item.id_produto !== idProduto));
            alert("Produto removido!");
        } catch (error) {
            console.error("Erro ao remover o produto.");
        }
    };

    const alterarQuantidade = async (idProduto, novaQuantidade) => {
        if (novaQuantidade < 1) return;
        try {
            await api.put('/carrinho/update-quantity', {
                idUsuario,
                idProduto,
                novaQuantidade
            });

            setItens(itens.map(item =>
                item.id_produto === idProduto
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            ));
        } catch (error) {
            console.error("Erro ao atualizar quantidade.");
        }
    };


    const finalizarCompra = async () => {
        const idUsuario = localStorage.getItem('id_usuario');
        const idAssinatura = localStorage.getItem('id_assinatura');

        if (!idAssinatura || idAssinatura === 'null') {
            alert("Erro: Assinatura não localizada. Por favor, refaça o login.");
            return;
        }

        try {
            await api.post('/carrinho/finalizar', {
                idUsuario: parseInt(idUsuario),
                idAssinatura: parseInt(idAssinatura)
            });
            alert("Pedido realizado!");
            navigate('/pedidos'); // Redireciona para a nova tela que criamos
        } catch (error) {
            console.error("Erro na finalização:", error.response?.data);
            alert("Erro interno no processamento da demanda.");
        }
    };
    return (
        <div className="cart-container">
            <header className="cart-header">
                <FaChevronLeft onClick={() => navigate(-1)} />
                <h2>Meu Carrinho</h2>
                <span className="badge">{itens.length}</span>
            </header>

            <div className="cart-layout">
                <section className="cart-items">
                    {itens.length > 0 ? (
                        itens.map(item => (
                            <div key={item.id_produto} className="cart-card">
                                <img src={item.imagem_url} alt={item.nome} />
                                <div className="item-details">
                                    <h4>{item.nome}</h4>
                                    <div className="quantity-control">
                                        <button onClick={() => alterarQuantidade(item.id_produto, item.quantidade - 1)}>-</button>
                                        <span>{item.quantidade}</span>
                                        <button onClick={() => alterarQuantidade(item.id_produto, item.quantidade + 1)}>+</button>
                                    </div>
                                </div>
                                <div className="item-price">
                                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                    <button className="btn-remove" onClick={() => removerItem(item.id_produto)}>
                                        <FaTrash /> Remover
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-cart-msg">Nenhum item localizado no memorial atual.</p>
                    )}
                </section>

                <aside className="order-summary">
                    <h3>Resumo do Pedido</h3>
                    <div className="summary-row">
                        <span>Subtotal ({itens.length} itens)</span>
                        <span>R$ {calcularTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row discount">
                        <span>Descontos</span>
                        <span>- R$ 0,00</span>
                    </div>
                    <div className="summary-row">
                        <span>Frete</span>
                        <span className="free">Grátis</span>
                    </div>
                    <hr />
                    <div className="summary-total">
                        <span>Total</span>
                        <span>R$ {calcularTotal().toFixed(2)}</span>
                    </div>


                    <button className="btn-finalize" onClick={finalizarCompra}>
                        Finalizar Compra
                    </button>

                    <p className="secure-text">Compra 100% segura e certificada</p>
                </aside>
            </div>
        </div>
    );
};

export default Carrinho;