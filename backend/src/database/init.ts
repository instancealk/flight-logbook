import fs from "fs";
import path from "path";
import pool from "../config/database";

export async function initializeDatabase(): Promise<void> {
  try {
    const sqlPath = path.join(__dirname, "migrations", "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await pool.query(sql);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
