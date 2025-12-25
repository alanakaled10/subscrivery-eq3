import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png'; 

const Header = () => {
  const [usuario, setUsuario] = useState({ nome: '', foto: '' });

  useEffect(() => {
    const sessao = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (sessao) {
      setUsuario(sessao);
    }
  }, []);

  return (
    <header className="top-header" style={{ backgroundColor: '#5a2d82' }}>
      <div className="header-brand">
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
          <img src={logoImg} alt="Logo" style={{ width: '28px', filter: 'brightness(0) invert(1)' }} />
          <span>subscrivery</span>
        </Link>
      </div>
      
      <div className="header-actions">
        <Link to="/profile" className="header-user-link" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="header-user">
            <span className="user-name">{usuario.nome}</span>
            <div className="avatar-icon" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ddd', borderRadius: '50%', width: '35px', height: '35px' }}>
              {usuario.foto ? (
                <img 
                  src={usuario.foto} 
                  alt="Perfil" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <i className="fas fa-user" style={{ color: '#666' }}></i>
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;