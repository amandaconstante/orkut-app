require("dotenv").config();
const express = require("express");
const pool = require("./config/db");
const validarPost = require("./validacao/post");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Rede Social</h1>")
});

app.get("/posts", async (req, res) => {
    console.log("chegou aqui..1");
    try {
        const resultado = await pool.query(`
            SELECT 
                u.id,
                u.nome, 
                p.titulo,
                p.conteudo, 
                p.criado_em,
                p.id AS post_id
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
});

/// ROTA POST PARA posts

app.post("/posts", async (req, res) => {
    try {
        const { titulo, conteudo, usuario_id } = req.body;

        const resultado = await pool.query(`
            INSERT INTO post (titulo, conteudo, usuario_id) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `, [titulo, conteudo, usuario_id]);
        res.status(201).json({
            mensagem: "Post criado com sucesso!",
            post: resultado.rows[0],
        });
    } catch (erro) {
        console.log("Deu ruim ao criar post... = " + erro);
        res.status(500).json({
            erro: "Erro ao criar post."
        })
    }
});

/// Rota posts PARA ATUALIZAR POST

app.put("/posts/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {titulo, conteudo} = req.body;

        const resultado = await pool.query(
            `UPDATE post SET titulo=$1, conteudo=$2 
            WHERE id=$3 
            RETURNING *`, [titulo, conteudo, id]
        );
        res.status(200).json({
            mensagem: "Post atualizado com sucesso!",
            post: resultado.rows[0]
        });
    } catch (erro) {
        console.log("Deu erro na atualização... = " + erro);
        res.status(500).json({
            erro: "Erro ao atualizar post."
        })
    }
});

app.delete("/posts/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const resultado = await pool.query(`
            DELETE FROM post WHERE id =$1
            RETURNING *
        `, [id],
        );
        res.json({
            mensagem: "Post deletado com sucesso!",
            post: resultado.rows[0],
        });
    } catch (erro) {
        console.log("Erro ao deletar.... = " + erro);
        res.status(500).json({
            erro: "Erro ao deletar post"
        });
    }
});

// ROTA DE LOGIN
app.post("/login", async (req, res) => {
    const {email, senha} = req.body;

    try {
        const usuario = await pool.query(`
            SELECT * FROM usuarios WHERE email=$1
        `, [email]);

        if (usuario.rows.length === 0) {
            return res.status(400).json({
            mensagem: "Usuário não encontrado"
            });
        }

        if (senha !== usuario.rows[0].senha) {
            return res.status(400).json({
                mensagem: "Senha inválida!"
            });
        }

        const token = jwt.sign(
            {id: usuario.rows[0].id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        console.log("login secret: ", process.env.JWT_SECRET);
        res.json({token});

    } catch (error) {
        console.log("Erro== " + erro);
        return res.status(500).json({
            mensagem: "Erro interno do servidor",
        });
    }

});

module.exports = app;