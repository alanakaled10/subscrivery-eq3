import Button from '../../components/Button/Button';
import './Plans.css';

export default function Plans() {
    return (
        <main className='plans-body'>
            <div className='plan-card'>
                <h2 className='plan-title'>Start</h2>
                <span className='plan-price'>R$ 49,90/mês</span>
                <p className='plan-text'>até R$ 200 em produtos/mês</p>
            </div>
            <div className='plan-card'>
                <h2 className='plan-title'>Plus</h2>
                <span className='plan-price'>R$ 89,90/mês</span>
                <p className='plan-text'>até R$ 400 em produtos/mês</p>
            </div>
            <div className='plan-card'>
                <h2 className='plan-title'>Ultra</h2>
                <span className='plan-price'>R$ 149,90/mês</span>
                <p className='plan-text'>até R$ 700 em produtos/mês</p>
            </div>

            <p>Seu plano vai ser renovado mensalmente de forma automática a menos que você cancele sua assinatura.</p>

            <div className="links-container">
                <a href="#termos">Termos & condições</a>
                <a href="#privacidade">Política de Privacidade</a>
            </div>

            <Button className="btn-secondary">Assinar</Button>
        </main>
    )
}