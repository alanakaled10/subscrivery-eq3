const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
    const { nome_completo, email, cpf, telefone, senha_hash } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha_hash, salt);

        const sql = `INSERT INTO usuario 
            (nome_completo, email, cpf, telefone, senha_hash, email_validado) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [nome_completo, email, cpf, telefone, hash, 0], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "E-mail ou CPF já cadastrados." });
                }
                return res.status(500).json({ error: "Erro ao registrar no banco." });
            }
            res.status(201).json({ 
                message: "Usuário registrado com sucesso!", 
                id_usuario: result.insertId 
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Erro no processamento da senha." });
    }
};

exports.criarAssinatura = (req, res) => {
    const { id_usuario, id_plano, forma_payment, id_frequencia } = req.body;

    if (!id_usuario || !id_plano) {
        return res.status(400).json({ error: "Dados insuficientes para processar a assinatura." });
    }

    const sql = `INSERT INTO assinatura 
        (status, data_inicio, fk_usuario_id_usuario, fk_plano_id_plano, fk_frequencia_id_frequencia, forma_pagamento) 
        VALUES ('ativa', NOW(), ?, ?, ?, ?)`;

    db.query(sql, [id_usuario, id_plano, id_frequencia || null, forma_payment], (err, result) => {
        if (err) {
            console.error("ERRO NO BANCO:", err.message);
            return res.status(500).json({ error: "Falha técnica ao registrar assinatura." });
        }
        res.status(201).json({ message: "Assinatura registrada com sucesso!" });
    });
};

exports.processarPagamentoSimulado = (req, res) => {
    const { id_usuario, id_plano, valor_total, forma_pagamento } = req.body;

    const sqlPagamento = "INSERT INTO pagamento (forma_pagamento, valor_total) VALUES (?, ?)";

    db.query(sqlPagamento, [forma_pagamento, valor_total], (err, resultPag) => {
        if (err) {
            console.error("Erro Pagamento:", err.message);
            return res.status(500).json({ error: "Falha ao registrar quitação." });
        }

        const sqlAssinatura = `UPDATE assinatura 
                               SET status = 'ativa' 
                               WHERE fk_usuario_id_usuario = ? AND fk_plano_id_plano = ? 
                               ORDER BY data_inicio DESC LIMIT 1`;

        db.query(sqlAssinatura, [id_usuario, id_plano], (errAss) => {
            if (errAss) {
                console.error("Erro Assinatura:", errAss.message);
                return res.status(500).json({ error: "Falha ao ativar plano." });
            }
            res.status(201).json({ message: "Pagamento e plano homologados!" });
        });
    });
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    const sql = `
        SELECT 
            u.id_usuario, 
            u.nome_completo, 
            u.email, 
            u.senha_hash,
            a.id_assinatura, -- Adicionado para identificar o contrato ativo
            a.fk_plano_id_plano AS id_plano
        FROM usuario u
        LEFT JOIN assinatura a ON u.id_usuario = a.fk_usuario_id_usuario AND a.status = 'ativa'
        WHERE u.email = ?
    `;

    db.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).json({ error: "Erro interno no servidor." });
        
        if (result.length > 0) {
            const user = result[0];
            const senhaValida = await bcrypt.compare(senha, user.senha_hash);

            if (senhaValida) {
                res.status(200).json({
                    message: "Login realizado com sucesso!",
                    user: {
                        id: user.id_usuario,
                        nome: user.nome_completo,
                        id_plano: user.id_plano || 4,
                        id_assinatura: user.id_assinatura // Retornando o ID do contrato
                    }
                });
            } else {
                res.status(401).json({ error: "E-mail ou senha incorretos." });
            }
        } else {
            res.status(401).json({ error: "E-mail ou senha incorretos." });
        }
    });
};


exports.listarCategorias = (req, res) => {
    const sql = "SELECT id_categoria, nome FROM categoria";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar categorias." });
        res.status(200).json(results);
    });
};

exports.listarProdutos = (req, res) => {
    const { categoria } = req.query;
    let sql = "SELECT id_produto, nome, preco, imagem_url FROM produto WHERE ativo = 1";
    let params = [];

    if (categoria) {
        sql += " AND categoria = ?"; 
        params.push(categoria);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar produtos." });
        res.status(200).json(results);
    });
};
exports.getPerfil = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            u.nome_completo, 
            u.email, 
            u.cpf, 
            COALESCE(a.fk_plano_id_plano, 4) as id_plano 
        FROM usuario u
        LEFT JOIN assinatura a ON u.id_usuario = a.fk_usuario_id_usuario
        WHERE u.id_usuario = ?
        ORDER BY a.id_assinatura DESC -- Garante que a assinatura mais nova venha primeiro
        LIMIT 1 -- Pega apenas a última (a atual)
    `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro interno." });
        if (result.length === 0) return res.status(404).json({ error: "Usuário não encontrado." });
        
        res.status(200).json(result[0]);
    });
};


exports.assinarOuMudarPlano = (req, res) => {
    const { idUsuario, idPlano, enderecoEntrega, formaPagamento } = req.body;

    const sqlVerificar = "SELECT id_assinatura FROM assinatura WHERE fk_usuario_id_usuario = ?";

    db.query(sqlVerificar, [idUsuario], (err, result) => {
        if (err) return res.status(500).json({ error: "Falha na verificação de registros." });

        if (result.length > 0) {
           
            const sqlUpdate = `
                UPDATE assinatura 
                SET fk_plano_id_plano = ?, endereco_entrega = ?, forma_pagamento = ?, status = 'ativa' 
                WHERE fk_usuario_id_usuario = ?`;
            
            db.query(sqlUpdate, [idPlano, enderecoEntrega, formaPagamento, idUsuario], (err) => {
                if (err) return res.status(500).json({ error: "Erro ao atualizar pacto contratual." });
                return res.status(200).json({ message: "Upgrade de plano realizado!" });
            });
        } else {
          
            const sqlInsert = `
                INSERT INTO assinatura (fk_usuario_id_usuario, fk_plano_id_plano, endereco_entrega, forma_pagamento, status) 
                VALUES (?, ?, ?, ?, 'ativa')`;
            
            db.query(sqlInsert, [idUsuario, idPlano, enderecoEntrega, formaPagamento], (err) => {
                if (err) return res.status(500).json({ error: "Erro ao criar novo vínculo." });
                return res.status(201).json({ message: "Assinatura inicial registrada!" });
            });
        }
    });
};

exports.atualizarDados = (req, res) => {
  
    const { id_usuario, nome_completo, cpf, telefone } = req.body;


    const sql = "UPDATE usuario SET nome_completo = ?, cpf = ?, telefone = ? WHERE id_usuario = ?";
    
    db.query(sql, [nome_completo, cpf, telefone, id_usuario], (err, result) => {
        if (err) {
            console.error("Erro SQL:", err);
            return res.status(500).json({ error: "Erro interno no banco de dados." });
        }
        res.status(200).json({ message: "Dados atualizados com sucesso!" });
    });
};