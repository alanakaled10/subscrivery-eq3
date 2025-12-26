import db from '../config/db.js';

export const salvarCartao = async (req, res) => {
    const { nome_titular, numero, bandeira } = req.body;
    const id_usuario = req.usuarioId; 
    try {
        const numero_final = numero.slice(-4);
        const token_pagamento = `tok_test_${Date.now()}`; 

        const query = "INSERT INTO cartao (fk_usuario_id_usuario, nome_titular, numero_final, bandeira, token_pagamento) VALUES (?, ?, ?, ?, ?)";
        await db.execute(query, [id_usuario, nome_titular, numero_final, bandeira, token_pagamento]);

        res.status(201).json({ mensagem: "Cartão vinculado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar cartão: " + err.message });
    }
};

export const listarCartoes = async (req, res) => {
    const id_usuario = req.usuarioId;
    try {
        const [rows] = await db.execute("SELECT id_cartao, nome_titular, numero_final, bandeira FROM cartao WHERE fk_usuario_id_usuario = ?", [id_usuario]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar cartões." });
    }
};

export const excluirCartao = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.usuarioId;
    try {
        await db.execute("DELETE FROM cartao WHERE id_cartao = ? AND fk_usuario_id_usuario = ?", [id, id_usuario]);
        res.json({ mensagem: "Cartão excluído." });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao excluir cartão." });
    }
};