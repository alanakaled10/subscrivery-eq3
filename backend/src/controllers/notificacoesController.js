const db = require('../config/db');

exports.getNotificacoes = async (req, res) => {
    const { idUsuario } = req.params;

    const sql = `
        SELECT 
            s.status AS mensagem, 
            s.data_evento, 
            p.id_pedidos AS referencia_id
        FROM status_pedidos s
        INNER JOIN pedidos p ON s.fk_pedidos_id_pedidos = p.id_pedidos
        INNER JOIN assinatura a ON p.fk_assinatura_id_assinatura = a.id_assinatura
        WHERE a.fk_usuario_id_usuario = ?
        ORDER BY s.data_evento DESC
        LIMIT 20
    `;

    try {

        const [results] = await db.execute(sql, [idUsuario]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Erro no prontuário de notificações." });
    }
};