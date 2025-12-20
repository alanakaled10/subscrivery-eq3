import db from '../config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const cadastro = async (req, res) => {
    const { nome_completo, email, senha, cpf, telefone } = req.body;
    try {
        const senha_hash = await bcrypt.hash(senha, 10);
        const query = `
            INSERT INTO usuario (nome_completo, email, cpf, telefone, senha_hash) 
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.execute(query, [nome_completo, email, cpf, telefone, senha_hash]);
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.error("ERRO NO BANCO:", err);
        res.status(500).json({ erro: "Erro técnico: " + err.message });
    }
};

export const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [rows] = await db.execute("SELECT * FROM usuario WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }
        const user = rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }
        res.json({ 
            mensagem: "Login realizado com sucesso!", 
            usuario: { id: user.id_usuario, nome: user.nome_completo } 
        });
    } catch (err) {
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
};


export const esqueciSenha = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.execute("SELECT id_usuario FROM usuario WHERE email = ?", [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ erro: "E-mail não encontrado." });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expiracao = new Date(Date.now() + 3600000); // 1 hora de validade

        await db.execute(
            "UPDATE usuario SET token_recuperacao = ?, data_expiracao_token = ? WHERE email = ?",
            [token, expiracao, email]
        );

        // Aqui você usaria o Nodemailer para enviar o e-mail
        // const link = `http://localhost:5173/redefinir-senha/${token}`;
        
        res.json({ mensagem: "Link de recuperação gerado! " });
    } catch (err) {
        res.status(500).json({ erro: "Erro interno." });
    }
};

export const redefinirSenha = async (req, res) => {
    const { token, novaSenha } = req.body;

    try {
        // 1. Procura o usuário com aquele token e verifica se ainda não expirou
        const query = `
            SELECT id_usuario FROM usuario 
            WHERE token_recuperacao = ? AND data_expiracao_token > NOW()
        `;
        const [rows] = await db.execute(query, [token]);

        if (rows.length === 0) {
            return res.status(400).json({ erro: "Token inválido ou expirado." });
        }

        // 2. Gera o hash da nova senha
        const senha_hash = await bcrypt.hash(novaSenha, 10);

        // 3. Atualiza a senha e limpa os campos de recuperação
        await db.execute(
            "UPDATE usuario SET senha_hash = ?, token_recuperacao = NULL, data_expiracao_token = NULL WHERE id_usuario = ?",
            [senha_hash, rows[0].id_usuario]
        );

        res.json({ mensagem: "Senha atualizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar senha." });
    }
};