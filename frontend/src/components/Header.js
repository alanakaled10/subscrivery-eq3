import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaBell } from 'react-icons/fa';
import logo from '../assets/logo.png';
import api from '../services/api';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [temNotificacao, setTemNotificacao] = useState(false);

 

  return (
    <header className="main-header">
      <button className="header-icon-btn" onClick={() => {
        setTemNotificacao(false); 
        navigate('/notificacoes');
      }}>
        
      </button>

      <div className="header-brand" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Subscrivery</h1>
      </div>

      <button className="header-icon-btn">
        <FaQuestionCircle size={20} color="#fff" />
      </button>
    </header>
  );
};

export default Header;