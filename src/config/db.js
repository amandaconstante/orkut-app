const {Pool} = require('pg');

module.exports = new Pool({
    //connectionString pq está sendo usado a Database_url longa
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }

    // se fosse feito linha por linha no env (separar host, senha etc)
    // seria:
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST


});