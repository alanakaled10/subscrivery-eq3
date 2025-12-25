import mysql from 'mysql2';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'subscrivery'
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro na conexão MySQL:', err.message);
    } else {
        console.log('Banco de Dados Conectado via src/config/db.js! 🗄️');
        connection.release();
    }
});

export default db.promise();