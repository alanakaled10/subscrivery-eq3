import db from '../config/db.js';

export const obterEstatisticas = async (req, res) => {
  const { idFornecedor } = req.query;

  if (!idFornecedor) {
    return res.status(400).json({ erro: "ID do fornecedor não informado." });
  }

  try {

    const [pedidosHoje] = await db.execute(
      "SELECT COUNT(*) as total FROM pedidos WHERE DATE(data_compra) = CURDATE() AND fk_fornecedor_id_fornecedor = ?",
      [idFornecedor]
    );


    const [entregasRota] = await db.execute(
      "SELECT COUNT(*) as total FROM pedidos p WHERE p.fk_fornecedor_id_fornecedor = ? AND( SELECT status FROM status_pedidos WHERE fk_pedidos_id_pedidos = p.id_pedidos ORDER BY data_evento DESC LIMIT 1 ) IN('Pendente', 'Em Rota')",
      [idFornecedor]
    );


    const [pedidosConcluidos] = await db.execute(
      "SELECT COUNT(*) as total FROM pedidos WHERE data_entrega IS NOT NULL AND fk_fornecedor_id_fornecedor = ?",
      [idFornecedor]
    );

    res.json({
      pedidosHoje: pedidosHoje[0].total,
      entregasRota: entregasRota[0].total,
      pedidosConcluidos: pedidosConcluidos[0].total
    });

  } catch (err) {
    console.error('Erro na instrução SQL do Dashboard:', err);
    res.status(500).json({ erro: "Erro ao consultar estatísticas personalizadas." });
  }
};

export const listarEntregasRecentes = async (req, res) => {
  const { idFornecedor } = req.query;

  if (!idFornecedor) {
    return res.status(400).json({ erro: "Identificação do fornecedor ausente." });
  }

  try {

    const [entregas] = await db.execute(`
    SELECT 
        p.id_pedidos AS id, 
        p.data_compra AS data,
        (SELECT u.nome_completo FROM usuario u 
         INNER JOIN assinatura a ON u.id_usuario = a.fk_usuario_id_usuario 
         WHERE a.id_assinatura = p.fk_assinatura_id_assinatura LIMIT 1) AS cliente,
        COALESCE(
          (SELECT status FROM status_pedidos WHERE fk_pedidos_id_pedidos = p.id_pedidos ORDER BY data_evento DESC LIMIT 1),
          IF(p.data_entrega IS NULL, 'Pendente', 'Entregue')
        ) AS status
    FROM pedidos p
    WHERE p.fk_fornecedor_id_fornecedor = ?
    -- REGRA DE EXCLUSÃO VISUAL: 
    -- Não mostramos na pauta de 'Recentes' o que já foi finalizado (Entregue)
    AND p.id_pedidos NOT IN (
        SELECT fk_pedidos_id_pedidos 
        FROM status_pedidos 
        WHERE status = 'Entregue'
    )
    ORDER BY p.data_compra DESC
    LIMIT 5
`, [idFornecedor]);

    res.json(entregas);
  } catch (err) {
    console.error('Falha na busca de entregas recentes:', err);
    res.status(500).json({ erro: "Erro ao buscar a lista de entregas." });
  }
};