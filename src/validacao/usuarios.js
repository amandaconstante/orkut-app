const Joi = require('joi');

const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
})

function validarUsuarios(req, res, next) {
    const {error} = usuarioSchema.validate(req.body, {abortEarly: false});
    if (error) {
        console.log("Erro usuarios/validacao: ", error);
        return res.status(400).json({
            erro: error.details.map(e => e.message)
        });
    }
    next();
}

module.exports = validarUsuarios;