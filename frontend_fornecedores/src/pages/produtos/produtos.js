import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header.js';
import api from '../../services/api.js';
import './Produtos.css';
import '../Dashboard/dashboard.css';

const Produtos = () => {
  const [todosProdutos, setTodosProdutos] = useState([]); 
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('ativos'); 
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [produtoIdAtual, setProdutoIdAtual] = useState(null);
  const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });

  const [novoProduto, setNovoProduto] = useState({
    nome: '', descricao: '', preco: '', imagem_url: '', categoria: ''
  });

  const dadosSessao = JSON.parse(localStorage.getItem('usuarioLogado'));
  const idFornecedor = dadosSessao?.id || dadosSessao?.id_fornecedor;

  const exibirNotificacao = (msg, tipo) => {
    setFeedback({ mensagem: msg, tipo });
    setTimeout(() => setFeedback({ mensagem: '', tipo: '' }), 4000);
  };

  const buscarAcervo = async () => {
    try {
      const res = await api.get(`/fornecedores/produtos/meus-produtos?idFornecedor=${idFornecedor}`);
      setTodosProdutos(res.data);
    } catch (err) {
      exibirNotificacao("Falha na consulta do acervo.", "erro");
    }
  };

  useEffect(() => {
    if (idFornecedor) buscarAcervo();
  }, [idFornecedor]);

  useEffect(() => {
    const resultado = todosProdutos.filter(p => {
      const statusMatch = filtroStatus === 'ativos' ? p.ativo !== 0 : p.ativo === 0;
      const textoMatch = p.nome.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                         (p.categoria && p.categoria.toLowerCase().includes(filtroTexto.toLowerCase()));
      return statusMatch && textoMatch;
    });
    setProdutosFiltrados(resultado);
  }, [filtroTexto, filtroStatus, todosProdutos]);

  const handleMudarStatus = async (id, statusAtual) => {
    const acao = statusAtual === 0 ? 'reativar' : 'inativar';
    if (window.confirm(`Deseja ${acao} este bem?`)) {
      try {
        await api.patch(`/fornecedores/produtos/${id}/${acao}`);
        exibirNotificacao(`Produto ${acao === 'reativar' ? 'reativado' : 'inativado'} com sucesso.`, "sucesso");
        buscarAcervo();
      } catch (err) {
        exibirNotificacao(`Erro ao proferir decisão de ${acao}.`, "erro");
      }
    }
  };

  const handleAbrirEdicao = (produto) => {
    setIsEditing(true);
    setProdutoIdAtual(produto.id_produto);
    setNovoProduto({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      imagem_url: produto.imagem_url || '',
      categoria: produto.categoria || ''
    });
    setShowModal(true);
  };

  const handleSalvarAlteracoes = async (e) => {
    if (e) e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/fornecedores/produtos/${produtoIdAtual}/atualizar`, {
          nome: novoProduto.nome,
          categoria: novoProduto.categoria,
          preco: novoProduto.preco,
          imagem_url: novoProduto.imagem_url,
          descricao: novoProduto.descricao
        });
        exibirNotificacao("Produto retificado com sucesso!", "sucesso");
      } else {
        await api.post('/fornecedores/produtos/cadastrar', {
          ...novoProduto,
          id_fornecedor: idFornecedor
        });
        exibirNotificacao("Objeto averbado no acervo!", "sucesso");
      }
      setShowModal(false);
      buscarAcervo();
    } catch (error) {
      exibirNotificacao("Erro ao salvar alterações no banco.", "erro");
    }
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
              <li className="active"><Link to="/produtos"><i className="fas fa-box-open"></i> Produtos</Link></li>
              <li><Link to="/relatorios"><i className="fas fa-file-alt"></i> Relatórios</Link></li>
              <li><Link to="/profile"><i className="fas fa-user-circle"></i> Perfil</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          {feedback.mensagem && <div className={`feedback-toast ${feedback.tipo}`}>{feedback.mensagem}</div>}

          <div className="header-secao">
            <h2>Gestão de Acervo Comercial</h2>
            <button onClick={() => { setIsEditing(false); setNovoProduto({nome:'', descricao:'', preco:'', imagem_url:'', categoria:''}); setShowModal(true); }} className="btn-save">
              <i className="fas fa-plus"></i> Novo Item
            </button>
          </div>

          <div className="filtros-container">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Pesquisar por nome ou categoria..." 
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>
            <div className="status-filter">
              <button className={filtroStatus === 'ativos' ? 'active' : ''} onClick={() => setFiltroStatus('ativos')}>Ativos</button>
              <button className={filtroStatus === 'inativos' ? 'active' : ''} onClick={() => setFiltroStatus('inativos')}>Inativos</button>
            </div>
          </div>

          <div className="produtos-grid">
            {produtosFiltrados.map(p => (
              <div key={p.id_produto} className={`produto-card ${p.ativo === 0 ? 'card-inativo' : ''}`}>
                {p.categoria && <span className="categoria-badge">{p.categoria}</span>}
                <img src={p.imagem_url || 'placeholder.png'} alt={p.nome} className="produto-img" />
                <div className="produto-info">
                  <h3>{p.nome}</h3>
                  <p className="preco">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.preco)}</p>
                  <div className="produto-acoes">
                    <button onClick={() => handleAbrirEdicao(p)} className="btn-edit-small" title="Editar"><i className="fas fa-edit"></i></button>
                    <button 
                      onClick={() => handleMudarStatus(p.id_produto, p.ativo)} 
                      className={p.ativo === 0 ? "btn-activate-small" : "btn-delete-small"}
                      title={p.ativo === 0 ? "Reativar" : "Inativar"}
                    >
                      <i className={p.ativo === 0 ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Retificar Produto' : 'Cadastrar Novo Produto'}</h3>
            <form onSubmit={handleSalvarAlteracoes}>
              <input type="text" placeholder="Nome" value={novoProduto.nome} required 
                onChange={e => setNovoProduto({...novoProduto, nome: e.target.value})} />
              <input type="text" placeholder="Categoria" value={novoProduto.categoria}
                onChange={e => setNovoProduto({...novoProduto, categoria: e.target.value})} />
              <input type="number" step="0.01" placeholder="Preço" value={novoProduto.preco} required 
                onChange={e => setNovoProduto({...novoProduto, preco: e.target.value})} />
              <input type="text" placeholder="URL da Imagem" value={novoProduto.imagem_url}
                onChange={e => setNovoProduto({...novoProduto, imagem_url: e.target.value})} />
              <textarea placeholder="Descrição" value={novoProduto.descricao}
                onChange={e => setNovoProduto({...novoProduto, descricao: e.target.value})} />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-confirm">{isEditing ? 'Salvar Alterações' : 'Averbar Produto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav className="mobile-tab-bar mobile-only">
        <Link to="/dashboard" className="tab-item "><i className="fas fa-chart-line"></i><span>Dashboard</span></Link>
        <Link to="/pedidos" className="tab-item"><i className="fas fa-solid fa-dolly"></i><span>Pedidos</span></Link>
        <Link to="/produtos" className="tab-item active"><i className="fas fa-box"></i><span>Produtos</span></Link>
        <Link to="/relatorios" className="tab-item"><i className="fas fa-file-alt"></i><span>Relatórios</span></Link>
        <Link to="/profile" className="tab-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
};

export default Produtos;