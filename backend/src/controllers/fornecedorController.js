import db from '../config/db.js';

export const buscarFornecedores = async (req, res) => {
    // Pegamos a cidade e categoria dos query params
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
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar fornecedores parceiros." });
    }
};