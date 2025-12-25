import db from '../config/db.js';

export const criarAssinatura = async (req, res) => {
    const { 
        id_plano, 
        frequencia_entrega, 
        endereco_entrega, 
        forma_pagamento,
        dados_cartao,
        id_fornecedor 
    } = req.body;
    
    const id_usuario = req.usuarioId;

    try {
       
        if (!endereco_entrega || endereco_entrega.length < 10) {
            return res.status(400).json({ erro: "Endereço de entrega completo é obrigatório." });
        }

        const formasValidas = ['cartão de crédito', 'cartão de débito'];
        if (!formasValidas.includes(forma_pagamento.toLowerCase())) {
            return res.status(400).json({ erro: "Forma de pagamento inválida. Use crédito ou débito." });
        }

        if (!dados_cartao || dados_cartao.numero.length < 16) {
            return res.status(400).json({ erro: "Dados do cartão inválidos para processamento." });
        }

       
        let diasParaAdicionar = 7; 
        if (frequencia_entrega === 'quinzenal') diasParaAdicionar = 15;
        if (frequencia_entrega === 'mensal') diasParaAdicionar = 30;

        const dataProxima = new Date();
        dataProxima.setDate(dataProxima.getDate() + diasParaAdicionar);

        
        const query = `
            INSERT INTO assinatura 
            (fk_usuario_id_usuario, fk_plano_id_plano, fk_frequencia_id_frequencia, fk_fornecedor_id_fornecedor, 
             endereco_entrega, forma_pagamento, status, data_inicio, proxima_entrega) 
            VALUES (?, ?, ?, ?, ?, ?, 'ativa', NOW(), ?)
        `;
        
        await db.execute(query, [
            id_usuario, 
            id_plano, 
            frequencia_entrega, 
            id_fornecedor, 
            endereco_entrega, 
            forma_pagamento, 
            dataProxima
        ]);

        res.status(201).json({ 
            mensagem: "Assinatura confirmada! Seu plano está ativo.",
            proxima_entrega: dataProxima.toLocaleDateString('pt-BR')
        });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao confirmar assinatura: " + err.message });
    }
};

export const listarAssinaturaUsuario = async (req, res) => {
    const id_usuario = req.usuarioId;

    try {
      
        const query = `
            SELECT a.*, p.nome as nome_plano, p.valor_mensal 
            FROM assinatura a
            JOIN plano p ON a.id_plano = p.id_plano
            WHERE a.id_usuario = ?
        `;
        const [rows] = await db.execute(query, [id_usuario]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar assinatura." });
    }
};

export const atualizarStatusAssinatura = async (req, res) => {
    const { id_assinatura, novoStatus } = req.body;
    const id_usuario = req.usuarioId; 


    const statusPermitidos = ['ativo', 'pausado', 'cancelado'];
    if (!statusPermitidos.includes(novoStatus)) {
        return res.status(400).json({ erro: "Status inválido. Use: ativo, pausado ou cancelado." });
    }

    try {

        const [assinatura] = await db.execute(
            "SELECT id_assinatura FROM assinatura WHERE id_assinatura = ? AND id_usuario = ?",
            [id_assinatura, id_usuario]
        );

        if (assinatura.length === 0) {
            return res.status(404).json({ erro: "Assinatura não encontrada ou você não tem permissão." });
        }


        await db.execute(
            "UPDATE assinatura SET status = ? WHERE id_assinatura = ?",
            [novoStatus, id_assinatura]
        );

        res.json({ mensagem: `Assinatura ${novoStatus === 'pausado' ? 'pausada' : 'cancelada'} com sucesso!` });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar status: " + err.message });
    }
};


export const obterHistoricoEntregas = async (req, res) => {
    const id_usuario = req.usuarioId; 

    try {
        const query = `
            SELECT 
                a.id_assinatura,
                p.nome AS plano_contratado,
                f.nome_fantasia AS fornecedor,
                a.data_inicio AS data_assinatura,
                a.proxima_entrega,
                a.status,
                a.frequencia_entrega
            FROM assinatura a
            JOIN plano p ON a.fk_plano_id_plano = p.id_plano
            JOIN fornecedor f ON a.fk_fornecedor_id_fornecedor = f.id_fornecedor
            WHERE a.fk_usuario_id_usuario = ?
        `;

        const [historico] = await db.execute(query, [id_usuario]);

        if (historico.length === 0) {
            return res.status(404).json({ mensagem: "Nenhuma entrega programada encontrada." });
        }

        res.json(historico);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao carregar histórico: " + err.message });
    }
};