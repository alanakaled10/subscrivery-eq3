import mysql from 'mysql2';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false
    }
});

// Mantivemos o teste de conexão simples para não quebrar o build
db.getConnection((err, connection) => {
    if (err) {
        console.log('Aviso: Erro ao tentar conectar (pode ser normal durante o build):', err.message);
    } else {
        console.log('Conexão com o banco realizada com sucesso!');
        connection.release();
    }
});

export default db.promise();
