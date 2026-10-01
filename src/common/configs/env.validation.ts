import Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string()
    .pattern(/^postgresql?:\/\//) // Asegura que empiece con postgres:// o postgresql://
    .required()
    .messages({
      'string.pattern.base':
        'DATABASE_URL debe ser una URL válida de PostgreSQL (postgres:// o postgresql://)',
    }),
  PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^(\d+(ms|s|m|h|d|w|y)|\d+)$/)
    .default('2h')
    .messages({
      'string.pattern.base':
        'JWT_EXPIRES_IN debe ser un número o una unidad de tiempo válida (ej: 60s, 15m, 2h, 7d)',
    }),
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
});
