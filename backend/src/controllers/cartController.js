const db = require('../config/db');

exports.getItensCarrinho = (req, res) => {
    const { idUsuario } = req.params;

    const sql = `
        SELECT 
            p.id_produto, 
            p.nome, 
            p.preco, 
            p.imagem_url, 
            c.quantidade 
        FROM carrinho c
        JOIN produto p ON c.fk_id_produto = p.id_produto
        WHERE c.fk_id_usuario = ?
    `;

    db.query(sql, [idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Falha na busca dos itens." });
        res.status(200).json(result);
    });
};

exports.adicionarAoCarrinho = (req, res) => {
    const { id_usuario, id_produto, quantidade } = req.body;
    
    const sql = "INSERT INTO carrinho (fk_id_usuario, fk_id_produto, quantidade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantidade = quantidade + ?";
    
    db.query(sql, [id_usuario, id_produto, quantidade, quantidade], (err) => {
        if (err) return res.status(500).json({ error: "Erro ao inserir item." });
        res.status(201).json({ message: "Item adicionado!" });
    });
};

exports.removerDoCarrinho = (req, res) => {
    const { idUsuario, idProduto } = req.params;

    const sql = "DELETE FROM carrinho WHERE fk_id_usuario = ? AND fk_id_produto = ?";

    db.query(sql, [idUsuario, idProduto], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao remover item do banco." });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item não encontrado no carrinho." });
        }
        
        res.status(200).json({ message: "Item removido com sucesso!" });
    });
};

exports.atualizarQuantidade = (req, res) => {
    const { idUsuario, idProduto, novaQuantidade } = req.body;

    if (novaQuantidade < 1) {
        return res.status(400).json({ error: "Quantidade mínima é 1. Use remover para excluir." });
    }

    const sql = "UPDATE carrinho SET quantidade = ? WHERE fk_id_usuario = ? AND fk_id_produto = ?";

    db.query(sql, [novaQuantidade, idUsuario, idProduto], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao atualizar quantidade no banco." });
        res.status(200).json({ message: "Quantidade atualizada!" });
    });
};




exports.finalizarCompra = async (req, res) => {
    const { idUsuario, idAssinatura } = req.body;

   
    if (!idUsuario || !idAssinatura || idAssinatura === 'null') {
        return res.status(400).json({ error: "Título de assinatura não localizado ou inválido." });
    }

    
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

       
        const [itens] = await connection.query(
            `SELECT c.fk_id_produto, c.quantidade, p.preco, p.id_fornecedor 
             FROM carrinho c 
             JOIN produto p ON c.fk_id_produto = p.id_produto 
             WHERE c.fk_id_usuario = ?`,
            [idUsuario]
        );

        if (itens.length === 0) {
            throw new Error("O Carrinho está vazio. Não há objeto para o negócio jurídico.");
        }

        const idFornecedor = itens[0].id_fornecedor;

      
        const [pedidoRes] = await connection.query(
            `INSERT INTO pedidos (fk_fornecedor_id_fornecedor, data_compra, fk_assinatura_id_assinatura) 
             VALUES (?, NOW(), ?)`,
            [idFornecedor, idAssinatura]
        );
        const idPedido = pedidoRes.insertId;

    
        for (const item of itens) {
            await connection.query(
                `INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) 
                 VALUES (?, ?, ?, ?)`,
                [idPedido, item.fk_id_produto, item.quantidade, item.preco]
            );
        }

    
        await connection.query(
            `INSERT INTO status_pedido (status, fk_pedidos_id_pedidos) 
             VALUES ('Processando', ?)`,
            [idPedido]
        );


        await connection.query("DELETE FROM carrinho WHERE fk_id_usuario = ?", [idUsuario]);

 
        await connection.commit();
        
        res.status(201).json({ 
            message: "Negócio Jurídico (Compra) Finalizado com Sucesso!", 
            idPedido: idPedido 
        });

    } catch (error) {
     
        await connection.rollback();
        console.error("ERRO NA INSTRUÇÃO SQL:", error.message);
        res.status(500).json({ error: "Falha na instrução do servidor: " + error.message });
    } finally {
        connection.release();
    }
};

exports.getMeusPedidos = async (req, res) => {
    const { idUsuario } = req.params;

    // JURIDICAMENTE: Buscamos a verdade real cruzando pedidos, itens e status
    const sql = `
        SELECT 
            p.id_pedidos, 
            p.data_compra, 
            (SELECT status FROM status_pedido 
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
        console.error("Erro na busca de pedidos:", err);
        res.status(500).json({ error: "Erro interno ao buscar histórico de pedidos." });
    }
};