const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'subscrivery' 
});

db.connect((err) => {
  if (err) {
    console.error('Erro de conexão com o Banco de Dados:', err);
    return;
  }
  console.log('Conexão com o Banco de Dados estabelecida com sucesso!');
});

module.exports = db;