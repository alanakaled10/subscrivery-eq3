import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'subscrivery',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro na conexão MySQL (Verifique seu .env):', err.message);
    } else {
        console.log('Banco de Dados Conectado com Variáveis de Ambiente! 🗄️');
        connection.release();
    }
});

export default db.promise();