import Button from '../../components/Button/Button'
import { Link, useNavigate } from "react-router-dom";
import "./Welcome.css";
import googleIcon from "../../assets/icons/google-icon.png";
import appleIcon from "../../assets/icons/apple-icon.png";
import facebookIcon from "../../assets/icons/facebook-icon.png";


export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">
          Bem-vindo <br />
          Subscrivery
        </h1>

        <p className="welcome-text">
          <Link to="/Register">Cadastre-se</Link> gratuitamente ou faça login.
        </p>

        <Button
          className="welcome-button btn-primary"
          onClick={() => navigate("/login")}
        >
          Continuar com email ou celular
        </Button>

        <div className="welcome-divider">ou</div>

        <div className="welcome-social">
          <button className="social-btn">
            <img src={googleIcon} alt="Google" />
          </button>
          <button className="social-btn">
            <img src={appleIcon} alt="Apple" />
          </button>
          <button className="social-btn">
            <img src={facebookIcon} alt="Faceboook" />
          </button>
        </div>
      </div>
    </div>
  );
}
