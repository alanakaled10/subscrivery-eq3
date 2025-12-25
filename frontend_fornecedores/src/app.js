import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login.js';
import Cadastro from './pages/cadastro/cadastro.js';
import Dashboard from './pages/Dashboard/Dashboard.js'; 
// Adicione a extensão .js explicitamente para sanar o erro do Webpack
import Profile from './pages/profile/profile.js'; 

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

          {/* Averbação da rota de Perfil sob proteção da PrivateRoute */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;