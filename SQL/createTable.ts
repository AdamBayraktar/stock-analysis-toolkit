import { readCSV } from "./readCSV.js";
import Stock from "../models/interfaces/Stock.interface.js";

const deleteTableSQL = `DROP TABLE IF EXISTS ceny_akcji;`;
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS ceny_akcji (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    cena REAL NOT NULL,
    waluta TEXT NOT NULL
  );
`;

export async function createTable(db: any) {
  db.exec(deleteTableSQL);
  db.exec(createTableSQL);
  const data = await readCSV();
  console.log(data.length);
  for (const row of data) {
    await insertDataIntoDB(db, row);
  }
}

const insertDataIntoDB = async (db: any, row: Stock) => {
  const insertSQL = `INSERT INTO ceny_akcji (data, cena, waluta) VALUES (?, ?, ?)`;

  await db.run(insertSQL, [row.date, row.price, row.currency]);
  console.log(`Inserted: ${row.date}, ${row.price}, ${row.currency}`);
};
