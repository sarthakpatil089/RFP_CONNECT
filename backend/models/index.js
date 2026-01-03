import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME||"ai_powered_rfp_db",
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'Test1234',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;