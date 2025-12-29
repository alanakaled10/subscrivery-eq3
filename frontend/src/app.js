import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './pages/welcome/WelcomeScreen';
import Login from './pages/login/login.js';
import Cadastro from './pages/cadastro/Cadastro';
import Home from './pages/home/Home';
import Planos from './pages/planos/Planos';
import Pagamento from './pages/Pagamento/Pagamento.js';
import Carrinho from './pages/carrinho/carrinho.js';
import Perfil from './pages/perfil/Perfil';
import DadosConta from './pages/dadosConta/DadosConta.js';
import Carteira from './pages/carteira/Carteira.js';
import Pedidos from './pages/pedidos/Pedidos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/dados-conta" element={<DadosConta />} />
        <Route path="/carteira" element={<Carteira />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </Router>
  );
}

export default App;