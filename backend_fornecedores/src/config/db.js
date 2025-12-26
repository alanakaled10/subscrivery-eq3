import mysql from 'mysql2';

const db = mysql.createPool({
    host: process.env.DB_HOST,       // Pega do Render
    user: process.env.DB_USER,       // Pega do Render
    password: process.env.DB_PASS,   // Pega do Render
    database: process.env.DB_NAME,   // Pega do Render (test)
    port: process.env.DB_PORT || 4000, // Pega do Render ou usa 4000
    ssl: {
        rejectUnauthorized: false    // 👈 O SEGREDO DO SUCESSO NO TIDB
    }
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro na conexão MySQL:', err.message);
    } else {
        console.log('Banco de Dados Conectado com Sucesso na Nuvem!');
        connection.release();
    }
});

export default db.promise();