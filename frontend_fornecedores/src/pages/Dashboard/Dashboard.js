import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../services/api.js';
import './dashboard.css';
import logoImg from '../../assets/logo.png';

const Dashboard = () => {
  const [usuario, setUsuario] = useState({ nome: 'Ivone Santana' });
  const [stats, setStats] = useState({ pedidosHoje: 0, entregasRota: 0, pedidosConcluidos: 0 });
  const [recentes, setRecentes] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  const CORES_PIZZA = ['#00B894', '#FDCB6E', '#FF7675'];

  const dadosGraficoBarras = [
    { name: 'Jan', pedidos: 8 }, { name: 'Fev', pedidos: 15 },
    { name: 'Mar', pedidos: 15 }, { name: 'Abr', pedidos: 22 },
    { name: 'Jun', pedidos: 12 }, { name: 'Jul', pedidos: 12 },
    { name: 'Oct', pedidos: 19 }, { name: 'Nov', pedidos: 19 },
    { name: 'Dez', pedidos: 27 },
  ];

 useEffect(() => {
    const dadosLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (dadosLogado) setUsuario(dadosLogado);

    const buscarDados = async () => {
      try {
      
        if (dadosLogado && dadosLogado.id) {
          const id = dadosLogado.id;
          
    
          const resStats = await api.get(`/dashboard/stats?idFornecedor=${id}`);
          setStats(resStats.data);
          
          const resEntregas = await api.get(`/dashboard/entregas?idFornecedor=${id}`);
          setRecentes(resEntregas.data);
        }
      } catch (error) {
        console.error("Erro na busca de dados do Dashboard:", error);
      }
    };
    
    buscarDados();
  }, []);

  const entregasFiltradas = recentes.filter(e =>
    e.cliente.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    e.id.toString().includes(termoPesquisa)
  );

  const dadosPizza = [
    { name: 'Concluídos', value: stats.pedidosConcluidos || 10 },
    { name: 'Pendentes', value: recentes.filter(r => r.status === 'Pendente').length || 5 },
    { name: 'Cancelados', value: 3 },
  ];

  return (
    <div className="dashboard-container">
      <header className="top-header">
        <div className="header-brand">
          <img src={logoImg} alt="Logo" />
          <span>subscrivery</span>
        </div>

        <div className="header-actions">
          <div className="header-icons desktop-only">
            <span className="icon-item"><i className="fas fa-bell"></i></span>
            <span className="icon-item"><i className="fas fa-cog"></i></span>
          </div>
          
          <Link to="/profile" className="header-user-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="header-user">
              <span className="user-name">{usuario.nome}</span>
              <div className="avatar-icon"><i className="fas fa-user"></i></div>
            </div>
          </Link>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar desktop-only">
          <nav className="sidebar-nav">
            <ul>
              <li className="active">
                <Link to="/dashboard">
                  <i className="fas fa-chart-line"></i> Dashboard
                </Link>
              </li>
              <li><i className="fas fa-box"></i> Pedidos</li>
              <li><i className="fas fa-truck"></i> Entregas</li>
              <li><i className="fas fa-users"></i> Clientes</li>
              <li><i className="fas fa-file-alt"></i> Relatórios</li>

              <li>
                <Link to="/profile">
                  <i className="fas fa-user-circle"></i> Perfil
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="main-title">
            <h2>Dashboard de Vendas</h2>
          </div>

          <section className="stats-container">
            <div className="card-stat">
              <div className="card-info">
                <h3>Pedidos Hoje: {stats.pedidosHoje}</h3>
                <div style={{ width: '100%', height: 180, marginTop: '10px' }}>
                  <ResponsiveContainer>
                    <BarChart data={dadosGraficoBarras} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11 }} />
                      <Tooltip cursor={{ fill: '#f3e8ff' }} />
                      <Bar dataKey="pedidos" fill="#5a2d82dd" radius={[4, 4, 0, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <div className="card-info">
                <h3>Entregas em Rota: {stats.entregasRota}</h3>
                <div className="map-container" style={{ width: '100%', height: '180px', marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' }}>
                  <iframe
                    title="Mapa de Entregas"
                    width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14652.123456789!2d-51.27!3d-23.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v123456789"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="card-stat card-concluidos">
              <div className="card-info" style={{ width: '100%', height: '100%' }}>
                <h3>Controle Mensal</h3>
                <div style={{ width: '100%', height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosPizza} cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                        paddingAngle={5} dataKey="value"
                      >
                        {dadosPizza.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle"
                        formatter={(value) => <span style={{ color: '#555', fontSize: '12px' }}>{value}</span>}
                      />
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
                <input
                  type="text" placeholder="Pesquisar cliente ou ID..."
                  value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)}
                />
              </div>
            </div>

            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {entregasFiltradas.length > 0 ? (
                    entregasFiltradas.map((e) => (
                      <tr key={e.id}>
                        <td>#{e.id}</td>
                        <td>{e.cliente}</td>
                        <td>
                          <span className={`status-badge ${e.status === 'Entregue' ? 'completed' : 'pending'}`}>
                            {e.status}
                          </span>
                        </td>
                        <td>{new Date(e.data).toLocaleDateString('pt-BR')}</td>
                        <td className="actions-cell">
                          <button className="btn-action"><i className="fas fa-edit"></i></button>
                          <button className="btn-action"><i className="fas fa-trash"></i></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="empty-msg">Nenhum registro encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <nav className="mobile-tab-bar mobile-only">
        <Link to="/dashboard" className="tab-item active">
          <i className="fas fa-chart-line"></i><span>Dashboard</span>
        </Link>
        <div className="tab-item"><i className="fas fa-box"></i><span>Pedidos</span></div>
        <div className="tab-item"><i className="fas fa-truck"></i><span>Entregas</span></div>
        <Link to="/profile" className="tab-item">
          <i className="fas fa-user"></i><span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;