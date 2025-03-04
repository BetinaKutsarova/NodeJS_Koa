import dotenv from 'dotenv';
dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000
  },
  db: {
    filePath: process.env.DB_FILE_PATH || './data'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt-secret',
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || '24h'
  }
};