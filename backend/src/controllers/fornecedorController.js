import db from '../config/db.js';

export const buscarFornecedores = async (req, res) => {
    const { cidade, id_categoria } = req.query;

    try {
        let sql = "SELECT * FROM fornecedor WHERE status = 'ativo'";
        const params = [];

        if (cidade) {
            sql += " AND cidade = ?";
            params.push(cidade);
        }

        if (id_categoria) {
            sql += " AND id_categoria = ?";
            params.push(id_categoria);
        }

        const [rows] = await db.execute(sql, params);
   
        if (rows.length === 0) {
            return res.status(200).json({ mensagem: "Nenhum fornecedor encontrado nesta região/categoria.", dados: [] });
        }

        res.json(rows);
    } catch (err) {
        console.error("Erro na busca:", err); 
        res.status(500).json({ erro: "Erro ao buscar fornecedores parceiros." });
    }
};