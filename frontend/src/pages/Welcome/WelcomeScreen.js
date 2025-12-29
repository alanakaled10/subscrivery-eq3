import React from 'react';
import { FaApple, FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/google-icon.png';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <h1 className="brand-text">Bem-vindo</h1>
        <h1 className="brand-text">Subscrivery</h1>

        <p className="login-text">
          <span className="link-register" onClick={() => navigate('/Cadastro')}>
            Cadastre-se
          </span> gratuitamente ou faça login.
        </p>

        <button className="btn-main" onClick={() => navigate('/login')}>
          Continuar com email ou celular
        </button>

        <div className="separator">
          <span>ou</span>
        </div>

        <div className="social-icons">
          <div className="icon-circle">
            <img src={googleIcon} alt="Google" className="social-img-icon" />
          </div>
          <div className="icon-circle">
            <FaApple size={24} color="#000000" />
          </div>
          <div className="icon-circle">
            <FaFacebook size={24} color="#1877F2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;