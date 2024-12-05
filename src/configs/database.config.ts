import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const envVarsSchema = Joi.object({
    DB_TYPE: Joi.string().valid('postgres', 'mysql', 'sqlite', 'mariadb').default('mysql'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(3306),
    DB_USERNAME: Joi.string().default('root'),
    DB_PASSWORD: Joi.string().default(''),
    DB_NAME: Joi.string().default('signalexact'),
}).unknown(true);

const { error, value: validatedEnv } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Database Config validation error: ${error.message}`);
}

export default registerAs('database', () => ({
    type: validatedEnv.DB_TYPE,
    host: validatedEnv.DB_HOST,
    port: validatedEnv.DB_PORT,
    username: validatedEnv.DB_USERNAME,
    password: validatedEnv.DB_PASSWORD,
    database: validatedEnv.DB_NAME,
}));
