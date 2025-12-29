import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../services/api';
import './Pagamento.css';

const Pagamento = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('credito');
  const [plano, setPlano] = useState(null);

  useEffect(() => {
    const salvo = localStorage.getItem('plano_selecionado');
    if (salvo) setPlano(JSON.parse(salvo));
  }, []);

  const finalizarPagamento = async (e) => {
    e.preventDefault();
    setLoading(true);

    const idUsuario = localStorage.getItem('id_usuario');

    try {
      await api.post('/auth/processar-pagamento', {
        id_usuario: idUsuario,
        id_plano: plano.id,
        valor_total: plano.preco.replace(',', '.'),
        forma_pagamento: formaPagamento
      });

      alert("Pagamento confirmado com sucesso!");
      navigate('/home');
    } catch (error) {
      alert("Erro ao processar transação financeira.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="pagamento-page">
        <h2 className="pagamento-title">Finalizar Assinatura</h2>
        
        {plano && (
          <div className="resumo-plano">
            <span>Plano {plano.nome}</span>
            <strong>R$ {plano.preco}</strong>
          </div>
        )}

        <form className="pagamento-form" onSubmit={finalizarPagamento}>
          <div className="metodo-pagamento">
            <label>Forma de Pagamento</label>
            <div className="radio-group">
              <label className={formaPagamento === 'credito' ? 'active' : ''}>
                <input type="radio" name="metodo" value="credito" checked={formaPagamento === 'credito'} onChange={(e) => setFormaPagamento(e.target.value)} />
                Cartão de Crédito
              </label>
              <label className={formaPagamento === 'debito' ? 'active' : ''}>
                <input type="radio" name="metodo" value="debito" checked={formaPagamento === 'debito'} onChange={(e) => setFormaPagamento(e.target.value)} />
                Cartão de Débito
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Número do Cartão</label>
            <input type="text" placeholder="0000 0000 0000 0000" required />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Validade</label>
              <input type="text" placeholder="MM/AA" required />
            </div>
            <div className="input-group">
              <label>CVV</label>
              <input type="text" placeholder="123" required />
            </div>
          </div>

          <button type="submit" className="btn-pagar" disabled={loading}>
            {loading ? "Processando..." : `Pagar R$ ${plano?.preco || ''}`}
          </button>
        </form>
      </div>
    </>
  );
};

export default Pagamento;