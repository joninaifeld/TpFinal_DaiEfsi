import dotenv from 'dotenv';
dotenv.config();

const config = {
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432
}

export default config;