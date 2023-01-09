// import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: process.env.MYSQL_DB_NAME,
  logging: false,
};

export = dbConfig;
// export default dbConfig;
// module.exports = dbConfig;
