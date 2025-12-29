const db = require('../config/db');

exports.getStatusCarteira = async (req, res) => {
    const { idUsuario } = req.params;
    const sql = `
        SELECT p.nome as nome_plano, a.id_assinatura, a.proxima_entrega,
            (SELECT COALESCE(SUM(ip.quantidade * ip.preco_unitario), 0)
             FROM pedidos ped
             JOIN item_pedido ip ON ped.id_pedidos = ip.id_pedido
             WHERE ped.fk_assinatura_id_assinatura = a.id_assinatura
             AND ped.data_compra >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            ) as total_gasto
        FROM usuario u
        JOIN assinatura a ON u.id_usuario = a.fk_usuario_id_usuario
        JOIN plano p ON a.fk_plano_id_plano = p.id_plano
        WHERE u.id_usuario = ? AND a.status = 'ativa'
    `;
    try {
        const [results] = await db.execute(sql, [idUsuario]);
        if (results.length === 0) return res.status(404).json({ error: "Assinatura ativa não encontrada." });

        const { nome_plano, total_gasto, proxima_entrega } = results[0];
        let limitePlano = nome_plano.toLowerCase().includes('premium') ? 700.00 : 
                          (nome_plano.toLowerCase().includes('intermediario') ? 400.00 : 200.00);

        res.status(200).json({
            saldo_atual: Math.max(0, limitePlano - parseFloat(total_gasto)),
            limite_plano: limitePlano,
            total_gasto: parseFloat(total_gasto),
            proxima_entrega,
            nome_plano
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao processar abatimento de crédito." });
    }
};

exports.getHistoricoCarteira = async (req, res) => {
    const { idUsuario } = req.params;
    const sql = `
        SELECT 
            p.id_pedidos as id,
            p.data_compra as data,
            'Compra Realizada' as descricao,
            SUM(ip.quantidade * ip.preco_unitario) as valor
        FROM pedidos p
        JOIN item_pedido ip ON p.id_pedidos = ip.id_pedido
        JOIN assinatura a ON p.fk_assinatura_id_assinatura = a.id_assinatura
        WHERE a.fk_usuario_id_usuario = ?
        GROUP BY p.id_pedidos
        ORDER BY p.data_compra DESC
    `;

    try {
        const [results] = await db.execute(sql, [idUsuario]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar extrato." });
    }
};
exports.getMeusPedidos = async (req, res) => {
    const { idUsuario } = req.params;

    const sql = `
        SELECT 
            p.id_pedidos, 
            p.data_compra, 
            (SELECT status FROM status_pedidos -- Ajustado para o plural
             WHERE fk_pedidos_id_pedidos = p.id_pedidos 
             ORDER BY data_evento DESC LIMIT 1) as status_atual,
            SUM(ip.quantidade * ip.preco_unitario) as valor_total
        FROM pedidos p
        JOIN item_pedido ip ON p.id_pedidos = ip.id_pedido
        JOIN assinatura a ON p.fk_assinatura_id_assinatura = a.id_assinatura
        WHERE a.fk_usuario_id_usuario = ?
        GROUP BY p.id_pedidos
        ORDER BY p.data_compra DESC
    `;

    try {
        const [results] = await db.execute(sql, [idUsuario]);
        res.status(200).json(results);
    } catch (err) {
        console.error("Erro na busca de pedidos:", err.message);
        res.status(500).json({ error: "Erro interno ao buscar histórico." });
    }
};