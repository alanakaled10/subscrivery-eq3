import db from '../config/db.js';

export const listarTodosPedidos = async (req, res) => {
  const { idFornecedor } = req.query;
  try {
    const [pedidos] = await db.execute(`
      SELECT 
        p.id_pedidos, 
        p.data_compra,
        -- Busca o cliente garantindo que a assinatura exista
        COALESCE(u.nome_completo, 'Cliente não identificado') AS cliente,
        COALESCE(
          (SELECT status FROM status_pedidos 
           WHERE fk_pedidos_id_pedidos = p.id_pedidos 
           ORDER BY data_evento DESC LIMIT 1),
          'Pendente'
        ) AS status,
        COALESCE(
          (SELECT data_evento FROM status_pedidos 
           WHERE fk_pedidos_id_pedidos = p.id_pedidos 
           ORDER BY data_evento DESC LIMIT 1),
          p.data_compra
        ) AS data_movimentacao
      FROM pedidos p
      LEFT JOIN assinatura a ON p.fk_assinatura_id_assinatura = a.id_assinatura
      LEFT JOIN usuario u ON a.fk_usuario_id_usuario = u.id_usuario
      WHERE p.fk_fornecedor_id_fornecedor = ?
      -- Removemos temporariamente o filtro de ocultos para testar a visibilidade
      ORDER BY p.id_pedidos DESC
    `, [idFornecedor]);
    
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar pedidos do banco." });
  }
};


export const atualizarStatusPedido = async (req, res) => {
  const { idPedido } = req.params;
  const { novoStatus } = req.body;
  try {
 
    await db.execute(
      "INSERT INTO status_pedidos (status, fk_pedidos_id_pedidos) VALUES (?, ?)",
      [novoStatus, idPedido]
    );
  
    await db.execute("UPDATE pedidos SET status = ? WHERE id_pedidos = ?", [novoStatus, idPedido]);
    
    res.json({ message: "Status atualizado com fé pública!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar status." });
  }
};

export const listarItensDoPedido = async (req, res) => {
  const { idPedido } = req.params;
  try {
    const [itens] = await db.execute(`
      SELECT 
        ip.quantidade, 
        ip.preco_unitario, 
        (ip.quantidade * ip.preco_unitario) AS subtotal,
        p.nome AS produto_nome,
        p.imagem_url
      FROM item_pedido ip
      JOIN produto p ON ip.id_produto = p.id_produto
      WHERE ip.id_pedido = ?  -- CORREÇÃO: Nome conforme image_25c0eb.png
    `, [idPedido]); 

    if (itens.length === 0) {
      return res.status(200).json([]); // Retorna lista vazia em vez de erro 404 para evitar o alerta
    }

    res.json(itens);
  } catch (err) {
    console.error("Erro SQL nos itens:", err);
    res.status(500).json({ erro: "Erro ao abrir os detalhes do pedido." });
  }
};

export const atualizarStatusEntrega = async (req, res) => {
    const { idPedido } = req.params;
    const { status } = req.body; 
    
    try {
       
        const sql = "INSERT INTO status_pedidos (status, fk_pedidos_id_pedidos) VALUES (?, ?)";
        await db.execute(sql, [status, idPedido]);
        
        res.status(200).json({ 
            message: "Despacho proferido e averbado no histórico!",
            status: status 
        });
    } catch (error) {
        console.error("Erro SQL:", error);
        res.status(500).json({ error: "Falha ao registrar status no histórico processual." });
    }
};
export const excluirEntrega = async (req, res) => {
    const { idPedido } = req.params;
    
    try {
      
        const sqlStatus = "DELETE FROM status_pedidos WHERE fk_pedidos_id_pedidos = ?";
        await db.execute(sqlStatus, [idPedido]);

        const sqlPedido = "DELETE FROM pedidos WHERE id_pedidos = ?";
        const [result] = await db.execute(sqlPedido, [idPedido]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Registro e histórico baixados com sucesso!" });
        } else {
            res.status(404).json({ error: "Mandado não encontrado para exclusão." });
        }
    } catch (error) {
        console.error("Erro na execução da baixa:", error);
        res.status(500).json({ error: "Falha ao excluir registro: Verifique restrições de chaves." });
    }
};




