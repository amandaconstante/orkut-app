const Joi = require('joi');


const postSchema = Joi.object({
    titulo: Joi.string().min(3).required().messages({
        "string.empty": "O Título é obrigatório",
        "string.min": "O Título deve ter pelo menos 3 caracteres",
        "any.required": "O Título é obrigatório"
    }),
    conteudo: Joi.string().min(5).required().messages({
        "string.empty": "O conteúdo do post é obrigatório",
        "string.min": "O conteúdo deve ter pelo menos 5 caracteres",
        "any.required": "O conteúdo é obrigatório"
    }),
    // usuario_id: Joi.number().integer().required().messages({
    //     "number.base": "O usuario_id deve ser um número",
    //     "number.integer": "O usuario_id deve ser um número inteiro",
    //     "any.required": "O usuario_id é obrigatório"
    // })
});

function validarPost(req, res, next) {
    const {error} = postSchema.validate(req.body, { abortEarly: false });

    if (error) {
        console.log("erro = " + error);
        return res.status(400).json({
            erro: error.details.map(e => e.message)
        });
    }
    next();
}

module.exports = validarPost;