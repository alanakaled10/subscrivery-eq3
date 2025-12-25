import React, { useEffect, useState } from 'react';
import Header from '../../components/Header.js';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../services/api.js';
import './dashboard.css';

const Dashboard = () => {
  const [usuario, setUsuario] = useState({ nome: 'Ivone Santana' });
  const [stats, setStats] = useState({ pedidosHoje: 0, entregasRota: 0, pedidosConcluidos: 0 });
  const [acervoStats, setAcervoStats] = useState({ ativos: 0, inativos: 0 });
  const [produtosAlerta, setProdutosAlerta] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [modalStatus, setModalStatus] = useState({ aberto: false, entregaId: null, statusAtual: '' });

  const LIMITE_ALERTA = 5;
  const CORES_PIZZA = ['#5a2d82', '#00B894', '#FF7675'];

  const dadosGraficoBarras = [
    { name: 'Jan', pedidos: 8 }, { name: 'Fev', pedidos: 15 },
    { name: 'Mar', pedidos: 15 }, { name: 'Abr', pedidos: 22 },
    { name: 'Jun', pedidos: 12 }, { name: 'Jul', pedidos: 12 },
    { name: 'Oct', pedidos: 19 }, { name: 'Nov', pedidos: 19 },
    { name: 'Dez', pedidos: 27 },
  ];

  const buscarDados = async () => {
    try {
      const dadosLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const id = dadosLogado?.id || dadosLogado?.id_fornecedor;

      if (id) {
        const resStats = await api.get(`/dashboard/stats?idFornecedor=${id}`);
        setStats(resStats.data);

        const resEntregas = await api.get(`/dashboard/entregas?idFornecedor=${id}`);
        setRecentes(resEntregas.data);

        const resProdutos = await api.get(`/fornecedores/produtos/meus-produtos?idFornecedor=${id}`);
        const produtos = resProdutos.data;

        setAcervoStats({
          ativos: produtos.filter(p => p.ativo !== 0).length,
          inativos: produtos.filter(p => p.ativo === 0).length
        });

        const baixos = produtos.filter(p => p.ativo !== 0 && (p.estoque <= LIMITE_ALERTA || p.quantidade <= LIMITE_ALERTA));
        setProdutosAlerta(baixos);
      }
    } catch (error) {
      console.error("Erro na busca de dados:", error);
    }
  };

  useEffect(() => {
    const dadosLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (dadosLogado) setUsuario(dadosLogado);
    buscarDados();
  }, []);

  const handleOcultarPedido = async (id) => {
    if (window.confirm("Deseja retirar este registro da visualização imediata?")) {
      try {
        await api.patch(`/fornecedores/pedidos/${id}/status-entrega`, { status: 'Oculto' });
        buscarDados();
      } catch (err) {
        alert("Erro ao ocultar registro.");
      }
    }
  };

  const handleAtualizarStatus = async (novoStatus) => {
    try {
      await api.patch(`/fornecedores/pedidos/${modalStatus.entregaId}/status-entrega`, {
        status: novoStatus
      });
      setModalStatus({ aberto: false, entregaId: null, statusAtual: '' });
      buscarDados();
    } catch (err) {
      alert("Falha ao proferir despacho de alteração.");
    }
  };

  const entregasFiltradas = recentes.filter(e =>
    e.cliente.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    e.id.toString().includes(termoPesquisa)
  );

  const dadosPizza = [
    { name: 'Bens Ativos', value: acervoStats.ativos },
    { name: 'Bens Inativos', value: acervoStats.inativos },
    { name: 'Pendentes', value: recentes.filter(r => r.status === 'Pendente').length },
  ];

  return (
    <div className="dashboard-container">
      <Header /> 
      
      <div className="dashboard-layout">
        <aside className="sidebar desktop-only">
          <nav className="sidebar-nav">
            <ul>
              <li className="active"><Link to="/dashboard"><i className="fas fa-chart-line"></i> Dashboard</Link></li>
              <li><Link to="/pedidos"><i className="fas fa-box"></i> Pedidos</Link></li>
              <li><Link to="/produtos"><i className="fas fa-box-open"></i> Produtos</Link></li>
              <li><Link to="/relatorios"><i className="fas fa-file-alt"></i> Relatórios</Link></li>
              <li><Link to="/profile"><i className="fas fa-user-circle"></i> Perfil</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="main-title"><h2>Gestão Estratégica e Acervo</h2></div>

          <section className="stats-container">
            <div className="card-stat">
              <div className="card-info">
                <h3>Vendas Consolidadas</h3>
                <div style={{ width: '100%', height: 180, marginTop: '10px' }}>
                  <ResponsiveContainer>
                    <BarChart data={dadosGraficoBarras} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11 }} />
                      <Tooltip cursor={{fill: '#f3e8ff'}} />
                      <Bar dataKey="pedidos" fill="#5a2d82dd" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <div className="card-info">
                <h3>Entregas em Rota: {stats.entregasRota}</h3>
                <div className="map-container" style={{ width: '100%', height: '180px', marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
                  <iframe title="Mapa" width="100%" height="100%" src="https://www.google.com/maps/embed" allowFullScreen></iframe>
                </div>
              </div>
            </div>

            <div className="card-stat card-concluidos">
              <div className="card-info">
                <h3>Distribuição Patrimonial</h3>
                <div style={{ width: '100%', height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dadosPizza} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                        {dadosPizza.map((entry, index) => (<Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          <section className="table-container">
            <div className="table-header">
              <h3>Status de Entregas Recentes</h3>
              <div className="search-box">
                <input type="text" placeholder="Pesquisar cliente ou ID..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} />
              </div>
            </div>
            <div className="responsive-table">
              <table>
                <thead>
                  <tr><th>ID</th><th>Cliente</th><th>Status</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {entregasFiltradas.map((e) => (
                    <tr key={e.id}>
                      <td>#{e.id}</td>
                      <td>{e.cliente}</td>
                      <td><span className={`status-badge ${e.status === 'Entregue' ? 'completed' : 'pending'}`}>{e.status}</span></td>
                      <td className="actions-cell">
                        <button className="btn-action edit" title="Editar Status" onClick={() => setModalStatus({ aberto: true, entregaId: e.id, statusAtual: e.status })}><i className="fas fa-edit"></i></button>
                        <button className="btn-action delete" title="Ocultar Registro" onClick={() => handleOcultarPedido(e.id)}><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {modalStatus.aberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Despachar Status: Entrega #{modalStatus.entregaId}</h3>
            <div className="modal-actions-status">
              <button className="btn-status pendente" onClick={() => handleAtualizarStatus('Pendente')}>Pendente</button>
              <button className="btn-status rota" onClick={() => handleAtualizarStatus('Em Rota')}>Em Rota</button>
              <button className="btn-status entregue" onClick={() => handleAtualizarStatus('Entregue')}>Entregue</button>
            </div>
            <button className="btn-cancel-modal" onClick={() => setModalStatus({ aberto: false })}>Fechar</button>
          </div>
        </div>
      )}

      <nav className="mobile-tab-bar mobile-only">
        <Link to="/dashboard" className="tab-item active"><i className="fas fa-chart-line"></i><span>Dashboard</span></Link>
        <Link to="/pedidos" className="tab-item"><i className="fas fa-solid fa-dolly"></i><span>Pedidos</span></Link>
        <Link to="/produtos" className="tab-item"><i className="fas fa-box"></i><span>Produtos</span></Link>
        <Link to="/relatorios" className="tab-item"><i className="fas fa-file-alt"></i><span>Relatórios</span></Link>
        <Link to="/profile" className="tab-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
};

export default Dashboard;