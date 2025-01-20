import sqlite3 from "sqlite3";
import { open } from "sqlite";

// you would have to import / invoke this in another file
export async function openDb() {
  return open({
    filename: "tmp/database.db",
    driver: sqlite3.Database,
  });
}

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS ceny_akcji (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    cena REAL NOT NULL,
    waluta TEXT NOT NULL
  );
`;
