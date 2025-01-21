import { readCSV } from "./readCSV.js";
import Stock from "../models/interfaces/Stock.interface.js";
import { Database } from "sqlite";

const deleteTableSQL = `DROP TABLE IF EXISTS ceny_akcji;`;
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS ceny_akcji (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    cena REAL NOT NULL,
    waluta TEXT NOT NULL
  );
`;

export async function createTable(db: Database) {
  await db.exec(deleteTableSQL);
  await db.exec(createTableSQL);
  const data = await readCSV();
  for (const row of data) {
    await insertDataIntoDB(db, row);
  }
}

const insertDataIntoDB = async (db: Database, row: Stock) => {
  const insertSQL = `INSERT INTO ceny_akcji (data, cena, waluta) VALUES (?, ?, ?)`;

  await db.run(insertSQL, [row.data, row.cena, row.waluta]);
};
