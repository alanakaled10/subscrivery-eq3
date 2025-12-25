import db from '../config/db.js';

export const obterDadosRelatorio = async (req, res) => {
  const { idFornecedor, dataInicio, dataFim } = req.query;

  try {

    const [resumo] = await db.execute(`
      SELECT 
        COALESCE(SUM(ip.quantidade * ip.preco_unitario), 0) as faturamento,
        COUNT(DISTINCT p.id_pedidos) as total_pedidos,
        COALESCE(SUM(ip.quantidade * ip.preco_unitario) / NULLIF(COUNT(DISTINCT p.id_pedidos), 0), 0) as ticket_medio
      FROM pedidos p
      LEFT JOIN item_pedido ip ON p.id_pedidos = ip.id_pedido
      WHERE p.fk_fornecedor_id_fornecedor = ? 
      AND p.data_compra BETWEEN ? AND ?
    `, [idFornecedor, dataInicio, dataFim]);

    const [categorias] = await db.execute(`
      SELECT pr.categoria, COUNT(ip.id_item) as quantidade_vendida
      FROM item_pedido ip
      JOIN produto pr ON ip.id_produto = pr.id_produto
      JOIN pedidos p ON ip.id_pedido = p.id_pedidos
      WHERE p.fk_fornecedor_id_fornecedor = ?
      AND p.data_compra BETWEEN ? AND ?
      GROUP BY pr.categoria
    `, [idFornecedor, dataInicio, dataFim]);

    res.json({
      resumo: resumo[0],
      categorias: categorias
    });
  } catch (err) {
    console.error("Erro na instrução probatória financeira:", err);
    res.status(500).json({ error: "Falha ao consolidar o relatório financeiro." });
  }
};