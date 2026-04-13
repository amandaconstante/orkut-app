const express = require("express");
const pool = require("./config/db");

const app = express();
app.get(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Rede Social</h1>")
});

app.get("/posts", async (req, res) => {
    console.log("chegou aqui..1");
    try {
        const resultado = await pool.query(`
            SELECT 
                u.nome, 
                p.conteudo, 
                p.criado_em
            FROM post p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.criado_em DESC
        `);
        res.json(resultado.rows);
            console.log("passou aqui..2");
    } catch (erro) {
        console.log("deu ruim..3 = " + erro);
        res.status(500).json({erro: "Erro ao obter post"});
    }
})

module.exports = app;