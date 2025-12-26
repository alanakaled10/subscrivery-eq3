import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const cadastrarFornecedor = async (req, res) => {
  const { nome_fantasia, razao_social, cnpj, email, senha } = req.body;

  if (!senha || senha.length < 8) {
    return res.status(400).json({
      error: "A senha deve ter no mínimo 8 caracteres."
    });
  }

  try {
    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    const sql = `
      INSERT INTO fornecedor 
      (nome_fantasia, razao_social, cnpj, email, senha, status) 
      VALUES (?, ?, ?, ?, ?, 'ativo')
    `;

    const [result] = await db.execute(sql, [
      nome_fantasia,
      razao_social,
      cnpj,
      email,
      senhaCriptografada
    ]);

    return res.status(201).json({
      message: "Fornecedor cadastrado com sucesso!",
      id: result.insertId
    });

  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Este CNPJ já está cadastrado no sistema." });
    }
    return res.status(500).json({ error: "Erro interno ao registrar no banco de dados." });
  }
};

export const loginFornecedor = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const sql = "SELECT * FROM fornecedor WHERE email = ?";
    const [usuarios] = await db.execute(sql, [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    const usuario = usuarios[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id_fornecedor,
        nome: usuario.nome_fantasia,
        foto: usuario.foto_url // Adicione esta linha
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const getPerfilById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ message: "ID não informado." });

    const [rows] = await db.execute(
      'SELECT id_fornecedor, cnpj, nome_fantasia, razao_social, status, foto_url FROM fornecedor WHERE id_fornecedor = ?',
      [id]
    );

    if (rows.length > 0) {
      return res.status(200).json(rows[0]);
    } else {
      return res.status(404).json({ message: "Fornecedor não encontrado nos autos." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const atualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { nome_fantasia, razao_social, cnpj, foto_url } = req.body; 
  
  try {
    const query = `UPDATE fornecedor SET nome_fantasia = ?, razao_social = ?, cnpj = ?, foto_url = ? WHERE id_fornecedor = ?`;
    const [result] = await db.execute(query, [nome_fantasia, razao_social, cnpj, foto_url, id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ error: "Registro não encontrado." });
    return res.status(200).json({ message: "Registro retificado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro na averbação dos dados." });
  }
};

export const alterarSenhaFornecedor = async (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  try {
    const [rows] = await db.execute('SELECT senha FROM fornecedor WHERE id_fornecedor = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Fornecedor não encontrado." });

    const senhaValida = await bcrypt.compare(senhaAtual, rows[0].senha);
    if (!senhaValida) return res.status(401).json({ error: "A senha atual informada é inválida." });

    const saltRounds = 10;
    const novaSenhaCripto = await bcrypt.hash(novaSenha, saltRounds);

    await db.execute('UPDATE fornecedor SET senha = ? WHERE id_fornecedor = ?', [novaSenhaCripto, id]);
    res.json({ message: "Senha retificada com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro na instrução processual de segurança." });
  }
};