export const EnvConfiguration = () => ({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  PORT: process.env.PORT || 3002,
  DEFAULT_LIMIT: +process.env.DEFAULT_LIMIT || 5,
  HOST_API: process.env.HOST_API,
  JWT_SECRET: process.env.JWT_SECRET,
});

const config = EnvConfiguration();

export type EnvConfig = typeof config;
