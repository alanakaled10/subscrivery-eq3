import db from '../config/db.js';

export const listarCategorias = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM categoria");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar categorias." });
    }
};