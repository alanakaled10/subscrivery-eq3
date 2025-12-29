import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../services/api';
import './Planos.css';

const Planos = () => {
  const navigate = useNavigate();
  const [frequencias, setFrequencias] = useState({});

  const listaPlanos = [
    { id: 4, nome: 'Avulso', preco: '0,00', limite: '0,00', desc: 'Pague apenas o frete e compre quando quiser.' },
    { id: 1, nome: 'Básico', preco: '49,90', limite: '200,00', desc: 'O essencial para suas compras programadas.' },
    { id: 2, nome: 'Intermediário', preco: '89,90', limite: '400,00', desc: 'Melhor custo-benefício com maior limite.' },
    { id: 3, nome: 'Premium', preco: '149,90', limite: '700,00', desc: 'Prioridade total e o maior limite da plataforma.' }
  ];

  const handleFrequenciaChange = (planoId, valor) => {
    setFrequencias({ ...frequencias, [planoId]: valor });
  };

 

  const selecionarPlano = async (plano) => {
  const idUsuario = localStorage.getItem('id_usuario');
  const freqEscolhida = frequencias[plano.id] || null;

  if (!idUsuario) {
    alert("Sessão expirada. Por favor, realize o login novamente.");
    return navigate('/login');
  }

  try {
    
    await api.put('/auth/migrar-plano', {
      idUsuario: idUsuario,
      idPlano: plano.id,
      id_frequencia: freqEscolhida,
      formaPagamento: 'cartão de crédito',
      enderecoEntrega: 'Endereço Principal'
    });

    localStorage.setItem('id_plano', plano.id);
    alert("Plano atualizado com sucesso!");
    navigate('/perfil'); 
  } catch (error) {
    console.error("Erro na transição de plano:", error);
    alert("Erro ao processar a mudança de plano.");
  }
};

  return (
    <>
      <Header />
      <div className="planos-page">
        <h2 className="planos-title">Seja Membro!</h2>
        <div className="planos-container">
          {listaPlanos.map((plano) => (
            <div key={plano.id} className="plano-card">
              <h3>{plano.nome}</h3>
              <p className="plano-price">R$ {plano.preco}<span>/mês</span></p>
              <div className="plano-limit">Crédito de R$ {plano.limite}</div>

              {plano.id !== 4 && (
                <div className="frequencia-selector">
                  <label>Receber a cada:</label>
                  <select
                    onChange={(e) => handleFrequenciaChange(plano.id, e.target.value)}
                    value={frequencias[plano.id] || ""}
                  >
                    <option value="">Selecione...</option>
                    <option value="1">7 dias</option>
                    <option value="2">15 dias</option>
                    <option value="3">30 dias</option>
                  </select>
                </div>
              )}

              <p className="plano-desc">{plano.desc}</p>
              <button onClick={() => selecionarPlano(plano)} className="btn-plano">
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Planos;