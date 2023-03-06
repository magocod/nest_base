import * as Joi from 'joi';
import { EnvConfig } from './env.config';

export const JoiValidationSchema = Joi.object<EnvConfig>({
  NODE_ENV: Joi.string().optional(),
  // server
  PORT: Joi.number().default(3000),
  HOST_API: Joi.string().optional(),
  LOG_HTTP_REQUEST: Joi.boolean().optional(),
  DEFAULT_LIMIT: Joi.number().default(5),
  // postgres
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  // auth
  JWT_SECRET: Joi.string().required(),
  // mongodb
  MONGO_URL: Joi.string().required(),
  MONGODB_DATABASE: Joi.string().required(),
  // mail
  MAIL_HOST: Joi.string().optional(),
  MAIL_USER: Joi.string().optional(),
  MAIL_PASSWORD: Joi.string().optional(),
  MAIL_FROM: Joi.string().optional(),
  MAIL_PORT: Joi.number().optional(),
  // redis
  REDIS_HOST: Joi.string().optional(),
  REDIS_PORT: Joi.number().optional(),
  REDIS_PASSWORD: Joi.string().optional(),
  // websockets
  WS_PORT: Joi.number().optional(),
  // mysql
  MYSQL_DB_PASSWORD: Joi.string().required(),
  MYSQL_DB_NAME: Joi.string().required(),
  // rabbitmq
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().optional(),
  RABBITMQ_PORT_MANAGEMENT: Joi.number().optional(),
  RABBITMQ_USERNAME: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required(),
  RABBITMQ_VHOST: Joi.string().required(),
});
