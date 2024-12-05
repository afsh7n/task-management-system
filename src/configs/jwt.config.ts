import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Define the schema for the JWT configuration validation
const jwtConfigSchema = Joi.object({
  JWT_SECRET: Joi.string().default('default_secret').description('The secret key used for signing JWT tokens'),  // JWT secret must be a string and required
  JWT_EXPIRES_IN: Joi.string().default('1h').valid('1h', '2h', '5h', '1d').description('JWT expiration time in hours or days'),  // Validates the expiration time (hours or days)
}).unknown(true); // Allows additional fields that are not part of the schema

// Validate environment variables using the schema
const { error, value: validatedEnv } = jwtConfigSchema.validate(process.env);

if (error) {
  throw new Error(`JWT Config validation error: ${error.message}`);  // Throws an error if validation fails
}

export default registerAs('jwt', () => ({
  JWT_SECRET: validatedEnv.JWT_SECRET || 'default_secret',  // Default to 'default_secret' if not provided
  JWT_EXPIRES_IN: validatedEnv.JWT_EXPIRES_IN || '1h',  // Default to '1h' if not provided
}));
