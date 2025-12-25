import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'subscrivery' 
});

console.log("Banco de dados conectado com sucesso! 🐬");

export default db;