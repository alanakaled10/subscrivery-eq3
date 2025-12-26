import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header.js';
import api from '../../services/api.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../Dashboard/dashboard.css';
import './relatorios.css';

const Relatorios = () => {
  const [usuario, setUsuario] = useState({ nome: '' });
  const [dados, setDados] = useState({ resumo: {}, categorias: [] });
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    inicio: '2025-01-01',
    fim: new Date().toISOString().split('T')[0]
  });

  const buscarRelatorio = async () => {
    const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));
    const id = sessao?.id || sessao?.id_fornecedor;
    if (!id) return;
    try {
      setUsuario(sessao);
      const res = await api.get(`/fornecedores/relatorios/consolidado`, {
        params: { idFornecedor: id, dataInicio: datas.inicio, dataFim: datas.fim }
      });
      setDados(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarRelatorio();
  }, [datas.inicio, datas.fim]);

  const exportarPDF = () => {
    const doc = new jsPDF();
    const nomeFornecedor = usuario.nome || usuario.nome_fantasia || "Fornecedor";

    doc.setFontSize(18);
    doc.setTextColor(90, 45, 130);
    doc.text(`Relatório de Performance - ${nomeFornecedor}`, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Período: ${new Date(datas.inicio).toLocaleDateString()} até ${new Date(datas.fim).toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Indicador', 'Valor']],
      body: [
        ['Faturamento Total', `R$ ${Number(dados.resumo?.faturamento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Ticket Médio', `R$ ${Number(dados.resumo?.ticket_medio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Volume de Pedidos', dados.resumo?.total_pedidos || '0'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [90, 45, 130] }
    });

    doc.save(`Relatorio_${nomeFornecedor}.pdf`);
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-layout">
        <aside className="sidebar desktop-only">
          <nav className="sidebar-nav">
            <ul>
              <li><Link to="/dashboard"><i className="fas fa-chart-line"></i> Dashboard</Link></li>
              <li><Link to="/pedidos"><i className="fas fa-box"></i> Pedidos</Link></li>
              <li><Link to="/produtos"><i className="fas fa-box-open"></i> Produtos</Link></li>
              <li className="active"><Link to="/relatorios"><i className="fas fa-file-alt"></i> Relatórios</Link></li>
              <li><Link to="/profile"><i className="fas fa-user-circle"></i> Perfil</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="relatorio-content-wrapper">
            <div className="relatorio-header-box">
              <h2 className="pedidos-title">Performance Comercial</h2>
              <div className="controles-relatorio">
                <div className="date-group">
                  <div className="input-field">
                    <label>Início</label>
                    <input type="date" value={datas.inicio} onChange={e => setDatas({ ...datas, inicio: e.target.value })} />
                  </div>
                  <div className="input-field">
                    <label>Fim</label>
                    <input type="date" value={datas.fim} onChange={e => setDatas({ ...datas, fim: e.target.value })} />
                  </div>
                </div>
                <button className="btn-pdf-export" onClick={exportarPDF}>
                  <i className="fas fa-file-pdf"></i> <span>Exportar PDF</span>
                </button>
              </div>
            </div>

            <div className="stats-grid">
              <div className="card-stat-new">
                <span className="stat-label">Faturamento Total</span>
                <p className="stat-value">R$ {Number(dados.resumo?.faturamento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="stat-indicator up"><i className="fas fa-arrow-up"></i> Período Ativo</div>
              </div>

              <div className="card-stat-new">
                <span className="stat-label">Ticket Médio</span>
                <p className="stat-value">R$ {Number(dados.resumo?.ticket_medio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className="stat-indicator"><i className="fas fa-chart-line"></i> Valor por Pedido</div>
              </div>

              <div className="card-stat-new">
                <span className="stat-label">Total de Pedidos</span>
                <p className="stat-value">{dados.resumo?.total_pedidos || 0}</p>
                <div className="stat-indicator"><i className="fas fa-box"></i> Protocolados</div>
              </div>
            </div>

            <div className="chart-section-card">
              <h3>Vendas por Categoria</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dados.categorias}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="categoria" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f3e8ff' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="quantidade_vendida" fill="#6c5ce7" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
      <nav className="mobile-tab-bar mobile-only">
        <Link to="/dashboard" className="tab-item "><i className="fas fa-chart-line"></i><span>Dashboard</span></Link>
        <Link to="/pedidos" className="tab-item"><i className="fas fa-solid fa-dolly"></i><span>Pedidos</span></Link>
        <Link to="/produtos" className="tab-item"><i className="fas fa-box"></i><span>Produtos</span></Link>
        <Link to="/relatorios" className="tab-item active"><i className="fas fa-file-alt"></i><span>Relatórios</span></Link>
        <Link to="/profile" className="tab-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
};

export default Relatorios;