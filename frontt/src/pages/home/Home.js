import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { FaHome, FaBox, FaUser, FaSearch, FaFire, FaRocket, FaGem, FaShoppingCart } from 'react-icons/fa';
import api from '../../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: '', id_plano: null });
  const [produtos, setProdutos] = useState([]);
  const [maisVendidos, setMaisVendidos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');

  const fetchProdutos = async (catNome = null) => {
    try {
      const url = catNome ? `/produtos?categoria=${catNome}` : '/produtos';
      const response = await api.get(url);
      setProdutos(response.data);
      setCategoriaAtiva(catNome);
    } catch (error) { console.error("Erro ao filtrar."); }
  };

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      const nome = localStorage.getItem('nome_usuario') || 'Membro';
      const plano = localStorage.getItem('id_plano');
      setUsuario({ nome, id_plano: parseInt(plano) });

      try {
        const [resCat, resProd] = await Promise.all([
          api.get('/auth/categorias'),
          api.get('/produtos')
        ]);
        setCategorias(resCat.data);
        setProdutos(resProd.data);
        setMaisVendidos(resProd.data.slice(0, 5));
      } catch (error) { console.error("Erro ao carregar dados iniciais."); }
    };
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (termoBusca.trim() === '') {
        fetchProdutos(categoriaAtiva);
        return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const response = await api.get(`/produtos?busca=${termoBusca}`);
        setProdutos(response.data);
      } catch (error) { console.error("Erro na busca."); }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [termoBusca]);

  const adicionarAoCarrinho = async (produto) => {
    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) return alert("Faça login para adicionar itens!");
    try {
      await api.post('/carrinho/add', {
        id_usuario: id_usuario,
        id_produto: produto.id_produto,
        quantidade: 1
      });
      alert(`${produto.nome} adicionado ao carrinho!`);
    } catch (error) { console.error("Erro ao adicionar."); }
  };

  return (
    <div className="home-wrapper">
      <aside className="sidebar-desktop">
        
        <nav>
          <button className="active" onClick={() => navigate('/home')}><FaHome /> Início</button>
          <button onClick={() => navigate('/carrinho')}><FaShoppingCart /> Carrinho</button>
          <button onClick={() => navigate('/pedidos')}><FaBox /> Meus Pedidos</button>
          <button onClick={() => navigate('/perfil')}><FaUser /> Perfil</button>
        </nav>
      </aside>

      <main className="home-main">
        <Header />
        <div className="home-content">
          <div className="search-container">
            <div className="search-bar">
              <FaSearch color="#888" />
              <input
                type="text"
                placeholder="O que você busca hoje?"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>

          <section className="ads-grid-container">
            {usuario.id_plano === 4 ? (
              <>
                <div className="ad-square partner">
                  <FaRocket className="ad-icon" />
                  <p>Seja nosso parceiro e <strong>economize no frete!</strong></p>
                </div>
                <div className="ad-square upgrade">
                  <FaGem className="ad-icon" />
                  <p>Assine o Premium e ganhe <strong>R$ 700 de crédito.</strong></p>
                </div>
              </>
            ) : (
              <>
                <div className="ad-square promo-anonovo">
                  <span>🥂</span>
                  <p>Ofertas de <strong>Ano Novo</strong></p>
                </div>
                <div className="ad-square volta-aulas">
                  <span>📚</span>
                  <p>Volta às <strong>Aulas</strong></p>
                </div>
              </>
            )}
          </section>

          <section className="best-sellers-section">
            <div className="section-header">
              <h3><FaFire color="#f59e0b" /> Mais Vendidos</h3>
            </div>
            <div className="horizontal-scroll">
              {maisVendidos.map(prod => (
                <div key={`best-${prod.id_produto}`} className="best-seller-card">
                  <img src={prod.imagem_url || 'https://via.placeholder.com/100'} alt={prod.nome} />
                  <div className="best-seller-info">
                    <h4>{prod.nome}</h4>
                    <span className="price">R$ {prod.preco}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="categorias-row">
            <button className={!categoriaAtiva ? 'active' : ''} onClick={() => fetchProdutos(null)}>Todos</button>
            {categorias.map(cat => (
              <button key={cat.id_categoria} className={categoriaAtiva === cat.nome ? 'active' : ''} onClick={() => fetchProdutos(cat.nome)}>{cat.nome}</button>
            ))}
          </section>

          <section className="product-section">
            <h3>{categoriaAtiva ? categoriaAtiva : 'Destaques'}</h3>
            <div className="products-grid">
              {produtos.map(prod => (
                <div key={prod.id_produto} className="product-card">
                  <div className="product-img">
                    <img src={prod.imagem_url || 'https://via.placeholder.com/150'} alt={prod.nome} />
                  </div>
                  <div className="product-info">
                    <h4>{prod.nome}</h4>
                    <span className="price">R$ {prod.preco}</span>
                    <button className="btn-add" onClick={() => adicionarAoCarrinho(prod)}>Adicionar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <nav className="bottom-nav-mobile">
          <button className="active" onClick={() => navigate('/home')}><FaHome /> <small>Home</small></button>
          <button onClick={() => navigate('/carrinho')}><FaShoppingCart /> <small>Carrinho</small></button>
          <button onClick={() => navigate('/pedidos')}><FaBox /> <small>Pedidos</small></button>
          <button onClick={() => navigate('/perfil')}><FaUser /> <small>Perfil</small></button>
        </nav>
      </main>
    </div>
  );
};

export default Home;