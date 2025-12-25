import db from '../config/db.js';

export const cadastrarProduto = async (req, res) => {
    const { nome, descricao, preco, imagem_url, categoria, id_fornecedor } = req.body;
    try {
        const query = `
            INSERT INTO produto (nome, descricao, preco, imagem_url, categoria, id_fornecedor) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.execute(query, [nome, descricao, preco, imagem_url, categoria, id_fornecedor]);
        res.status(201).json({ message: "Produto averbado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao registrar o objeto no banco." });
    }
};

export const listarProdutosFornecedor = async (req, res) => {
    const { idFornecedor } = req.query;
    try {
        const [produtos] = await db.execute('SELECT * FROM produto WHERE id_fornecedor = ?', [idFornecedor]);
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao consultar o acervo." });
    }
};


export const atualizarProduto = async (req, res) => {
  const { id_produto } = req.params; // Captura o ID da URL
  const { nome, categoria, preco, imagem_url, descricao } = req.body;

  try {
    const precoFormatado = typeof preco === 'string' ? preco.replace(',', '.') : preco;

    const sql = `
      UPDATE produto 
      SET nome = ?, descricao = ?, preco = ?, imagem_url = ?, categoria = ? 
      WHERE id_produto = ?
    `;

    const [result] = await db.execute(sql, [
      nome, 
      descricao, 
      precoFormatado, 
      imagem_url, 
      categoria, 
      id_produto 
    ]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Registro retificado com sucesso!" });
    } else {
      res.status(404).json({ error: "Produto não encontrado nos autos." });
    }
  } catch (error) {
    console.error("Erro SQL:", error);
    res.status(500).json({ error: "Erro na operação processual no banco." });
  }
};

export const inativarProduto = async (req, res) => {
    const { id_produto } = req.params;
    try {
        const [result] = await db.execute(
            "UPDATE produto SET ativo = 0 WHERE id_produto = ?",
            [id_produto]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Objeto não encontrado no acervo." });
        }
        
        res.json({ message: "Produto inativado com sucesso." });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao processar a inativação no banco de dados." });
    }
};

export const reativarProduto = async (req, res) => {
    const { id_produto } = req.params;
    try {
        const [result] = await db.execute(
            "UPDATE produto SET ativo = 1 WHERE id_produto = ?",
            [id_produto]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Objeto não encontrado no acervo." });
        }
        
        res.json({ message: "Produto reativado com sucesso." });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao processar a reativação no banco de dados." });
    }
};