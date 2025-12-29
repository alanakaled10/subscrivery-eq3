import db from '../config/db.js';

export const listarCategorias = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT id_categoria, nome FROM categoria"); 
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};