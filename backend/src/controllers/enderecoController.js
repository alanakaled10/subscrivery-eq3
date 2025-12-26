import db from '../config/db.js';

export const salvarEndereco = async (req, res) => {
    const { logradouro, numero, bairro, cidade, cep } = req.body;
    const id_usuario = req.usuarioId;

    try {
        const query = "INSERT INTO endereco (fk_usuario_id_usuario, logradouro, numero, bairro, cidade, cep) VALUES (?, ?, ?, ?, ?, ?)";
        await db.execute(query, [id_usuario, logradouro, numero, bairro, cidade, cep]);
        res.status(201).json({ mensagem: "Endereço cadastrado!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar endereço." });
    }
};

export const listarEnderecos = async (req, res) => {
    const id_usuario = req.usuarioId;
    try {
        const [rows] = await db.execute("SELECT * FROM endereco WHERE fk_usuario_id_usuario = ?", [id_usuario]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar endereços." });
    }
};