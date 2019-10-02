const Joi = require('joi')
const path = require('path')

require('dotenv').config(path.join(__dirname, '../.env'))
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    PORT: Joi.number(),
    URL: Joi.string().required()
}).unknown()
    .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
    throw error
}

const config = {
    env: envVars.NODE_ENV,
    server: {
        port: envVars.PORT
    },
    prefix: envVars.URL
}
module.exports = config
