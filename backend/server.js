import express from 'express';
import mysql from 'mysql2/promise'; 
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();


app.use(express.json());
app.use(cors());

// Configuração da conexão com o MySQL (XAMPP)
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'subscrivery' 
});

console.log("Conectado ao MySQL com sucesso! 🐬");


app.post('/usuarios', async (req, res) => {
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
        // MUITO IMPORTANTE: Isso vai mostrar o erro real no seu terminal do VS Code
        console.error("ERRO REAL DO BANCO:", err); 
        
        // Retorna o erro real para a tela para sabermos o que é
        res.status(500).json({ erro: "Erro técnico: " + err.message });
    }
});

// --- ROTA DE LOGIN ---
app.post('/login', async (req, res) => {
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
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000! 🚀"));
