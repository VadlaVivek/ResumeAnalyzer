import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: false, // set true if your PG requires SSL
});

pool.on("error", (err) => {
  console.error("Unexpected PG error", err);
  process.exit(1);
});
