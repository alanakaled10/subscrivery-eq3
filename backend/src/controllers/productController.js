const db = require('../config/db');

exports.pesquisarProdutos = (req, res) => {
 const { busca, categoria } = req.query;
    let sql = "SELECT * FROM produto WHERE ativo = 1";
    let params = [];

    if (busca) {
        sql += " AND nome LIKE ?";
        params.push(`%${busca}%`); 
    }

    if (categoria) {
        sql += " AND categoria = ?";
        params.push(categoria);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro interno no banco." });
        res.status(200).json(results);
    });
};