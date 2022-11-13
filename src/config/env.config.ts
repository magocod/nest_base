export const EnvConfiguration = () => ({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  LOG_HTTP_REQUEST: process.env.LOG_HTTP_REQUEST,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  PORT: process.env.PORT || 3002,
  DEFAULT_LIMIT: +process.env.DEFAULT_LIMIT || 5,
  HOST_API: process.env.HOST_API,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URL: process.env.MONGO_URL,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM: process.env.MAIL_FROM,
  MAIL_PORT: process.env.MAIL_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
});

const config = EnvConfiguration();

export type EnvConfig = typeof config;
