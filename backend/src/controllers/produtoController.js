import db from '../config/db.js';

export const listarProdutos = async (req, res) => {
    try {
        
        const query = "SELECT id_produto, nome, descricao, preco, preco_assinante, imagem_url FROM produto WHERE ativo = 1";
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar produtos no banco de dados." });
    }
};