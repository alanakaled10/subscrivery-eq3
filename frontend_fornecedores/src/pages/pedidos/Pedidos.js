import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header.js';
import api from '../../services/api.js';
import '../Dashboard/dashboard.css';
import './pedidos.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroData, setFiltroData] = useState('30');
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [itensPedido, setItensPedido] = useState([]);

  const buscarPedidos = async () => {
    try {
      const dadosLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const id = dadosLogado?.id || dadosLogado?.id_fornecedor;
      if (id) {
        const response = await api.get(`/fornecedores/pedidos/todos-pedidos?idFornecedor=${id}`);
        setPedidos(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { buscarPedidos(); }, []);

  const togglePedido = async (id) => {
    if (pedidoAberto === id) {
      setPedidoAberto(null);
    } else {
      try {
        const response = await api.get(`/fornecedores/pedidos/${id}/itens`);
        setItensPedido(response.data);
        setPedidoAberto(id);
      } catch (error) {
        alert("Erro ao carregar itens.");
      }
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    const dataPedido = new Date(p.data_movimentacao || p.data_compra);
    const hoje = new Date();
    const difDias = Math.floor((hoje - dataPedido) / (1000 * 60 * 60 * 24));
    const batePesquisa = (p.cliente || "").toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                         (p.id_pedidos || "").toString().includes(termoPesquisa);
    const bateStatus = filtroStatus === 'Todos' || p.status === filtroStatus;
    const bateData = filtroData === 'Todos' || difDias <= parseInt(filtroData);
    return batePesquisa && bateStatus && bateData;
  });

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-layout">
        <aside className="sidebar desktop-only">
          <nav className="sidebar-nav">
            <ul>
              <li><Link to="/dashboard"><i className="fas fa-chart-line"></i> Dashboard</Link></li>
              <li className="active"><Link to="/pedidos"><i className="fas fa-solid fa-dolly"></i> Pedidos</Link></li>
              <li><Link to="/produtos"><i className="fas fa-box"></i> Produtos</Link></li>
              <li><Link to="/relatorios"><i className="fas fa-file-alt"></i> Relatórios</Link></li>
              <li><Link to="/profile"><i className="fas fa-user-circle"></i> Perfil</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="pedidos-main-content">
            <h2 className="pedidos-title">Gestão de Pedidos</h2>
            
            <div className="pedidos-table-container">
              <div className="table-controls-responsive">
                <div className="search-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    value={termoPesquisa} 
                    onChange={(e) => setTermoPesquisa(e.target.value)} 
                  />
                </div>
                <div className="filter-group-responsive">
                  <select className="filter-select-mobile" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                    <option value="Todos">Todos Status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Rota">Em Rota</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                  <select className="filter-select-mobile" value={filtroData} onChange={(e) => setFiltroData(e.target.value)}>
                    <option value="7">7 dias</option>
                    <option value="30">30 dias</option>
                    <option value="Todos">Tudo</option>
                  </select>
                </div>
              </div>

              <div className="responsive-table">
                <table className="pedidos-table">
                  <thead>
                    <tr><th>ID</th><th>Cliente</th><th>Data</th><th>Status</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="empty-msg">Processando...</td></tr>
                    ) : pedidosFiltrados.map(p => (
                      <React.Fragment key={p.id_pedidos}>
                        <tr onClick={() => togglePedido(p.id_pedidos)} className="row-clickable">
                          <td data-label="ID"><strong>#{p.id_pedidos}</strong></td>
                          <td data-label="Cliente">{p.cliente}</td>
                          <td data-label="Data">{new Date(p.data_compra).toLocaleDateString('pt-BR')}</td>
                          <td data-label="Status">
                            <span className={`badge ${String(p.status).toLowerCase().replace(/ /g, "-")}`}>
                                {p.status}
                            </span>
                          </td>
                          <td data-label="Detalhes" className="td-chevron">
                            <i className={`fas ${pedidoAberto === p.id_pedidos ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                          </td>
                        </tr>
                        {pedidoAberto === p.id_pedidos && (
                          <tr className="row-details">
                            <td colSpan="5">
                              <div className="details-expanded">
                                <h4>Itens da Lide:</h4>
                                {itensPedido.map((item, idx) => (
                                  <div key={idx} className="item-detail">
                                    <span>{item.quantidade}x {item.produto_nome}</span>
                                    <strong>R$ {item.preco_unitario}</strong>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <nav className="mobile-tab-bar mobile-only">
        <Link to="/dashboard" className="tab-item"><i className="fas fa-chart-line"></i><span>Dashboard</span></Link>
        <Link to="/pedidos" className="tab-item active"><i className="fas fa-solid fa-dolly"></i><span>Pedidos</span></Link>
        <Link to="/produtos" className="tab-item"><i className="fas fa-box"></i><span>Produtos</span></Link>
        <Link to="/relatorios" className="tab-item"><i className="fas fa-file-alt"></i><span>Relatórios</span></Link>
        <Link to="/profile" className="tab-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
};

export default Pedidos;