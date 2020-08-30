const mysql = require('mysql2');

const pool = mysql.createPool({ 
    host: 'localhost',
    user: 'test-user',
    database: 'node-complete',
    password: '123user!!!'
});

module.exports = pool.promise();