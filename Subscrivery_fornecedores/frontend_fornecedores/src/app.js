import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login.js';
import Cadastro from './pages/cadastro/cadastro.js';
import Dashboard from './pages/Dashboard/Dashboard.js'; 
import Profile from './pages/profile/profile.js'; 
import Pedidos from './pages/pedidos/Pedidos.js'; 
import Produtos from './pages/produtos/produtos.js';
import Relatorios from './pages/relatorio/Relatorios.js';

const PrivateRoute = ({ children }) => {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  return usuarioLogado ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
         
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />

    
          <Route 
            path="/pedidos" 
            element={
              <PrivateRoute>
                <Pedidos />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/produtos" 
            element={
              <PrivateRoute>
                <Produtos />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/relatorios" 
            element={
              <PrivateRoute>
                <Relatorios />
              </PrivateRoute>
            } 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;