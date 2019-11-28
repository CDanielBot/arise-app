
import * as joi from 'joi'
const custom_env = require('custom-env')
const colors = require('colors/safe')

function loadEnvAndValidate() {

    custom_env.env(process.env.NODE_ENV)

    const schema = joi.object({
        NODE_ENV: joi.string()
            .allow(['dev', 'prod', 'test'])
            .required(),
        PORT: joi.number().required(),
        SERVER_URL: joi.string().required(),

        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().required(),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_DATABASE: joi.string().required(),
        DB_QUERY_TIMEOUT: joi.number().required(),
        DB_POOL_SIZE: joi.number().required(),

        FIREBASE_DB_URL: joi.string().required(),
        FIREBASE_KEY_FILE_PATH: joi.string().required()
    }).unknown()
        .required()

    const { value, error } = joi.validate(process.env, schema)
    if (error) {
        throw new Error(`Config validation error: ${error.message}`)
    }
    console.log(`Application started in ${colors.green.bold(process.env.NODE_ENV.toUpperCase())} mode!`)
    return value
}

const envVars = loadEnvAndValidate()

export const config = {
    env: envVars.NODE_ENV,
    isTest: envVars.NODE_ENV === 'test',
    isDev: envVars.NODE_ENV === 'dev',
    isProd: envVars.NODE_ENV === 'prod',
    server: {
        port: parseInt(envVars.PORT),
        url: envVars.SERVER_URL
    },
    firebase_db_url: envVars.FIREBASE_DB_URL,
    firebase_key_path: envVars.FIREBASE_KEY_FILE_PATH
}

export const dbConfig = {
    host: envVars.DB_HOST,
    port: parseInt(envVars.DB_PORT),
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_DATABASE,
    query_timeout: parseInt(envVars.DB_QUERY_TIMEOUT),
    pool_size: parseInt(envVars.DB_POOL_SIZE)
}