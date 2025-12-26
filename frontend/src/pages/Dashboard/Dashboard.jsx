import "./Dashboard.css";

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <div className="endereco-container">
                <span>icone</span>
                <p>Enviar para Júlia - Londrina 8902...</p>
                <button className="expand-btn">expandir</button>
            </div>

            <div className="section-especial category-section">
                <div className="category-card">
                    <span className="title-card">
                        Ofertas de Natal
                    </span>
                </div>
                <div className="category-card">
                    <span className="title-card">
                        Volta as aulas
                    </span>
                </div>
            </div>

            <div className="mais-pedidos">
                <h3>Mais pedidos</h3>

                <div className="produtos-container">
                    <div className="produto-card"></div>
                    <div className="produto-card"></div>
                    <div className="produto-card"></div>
                </div>
            </div>

            <div className="recomendados">
                <h3>Recomendados</h3>

                <div className="produtos-container">
                    <div className="category-card"></div>
                    <div className="category-card"></div>
                    <div className="category-card"></div>
                </div>
            </div>
        </div>
    )
}