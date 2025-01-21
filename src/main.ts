import { openDb } from "../SQL/openDB.js";
import { createTable } from "../SQL/createTable.js";
import { Database } from "sqlite";
import { readCSV } from "../SQL/readCSV.js";
import readline from "readline";
import StockAnalysis from "../models/classes/StockAnalysis.class.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "If you want to calculate from DB enter 'DB' otherwise to calculate from CSV enter anything else: ",
  async (answer) => {
    if (answer.trim().toUpperCase() === "DB") {
      (async () => {
        console.log("Starting DB processing...");
        const db: Database = await openDb();
        try {
          // Fetch all rows
          await createTable(db);
          const result = await fetchAllRows(db);

          // Ensure all rows are fetched before processing
          console.log("Starting main processing...");
          //   await main(result);
          new StockAnalysis(result).consoleSummary();
        } catch (err) {
          console.error("Error occurred:", err);
        } finally {
          await db.close();
        }
      })();
    } else {
      (async () => {
        console.log("Starting CSV processing...");

        const result = await readCSV();
        console.log("Starting main processing...");
        new StockAnalysis(result).consoleSummary();
      })();
    }
    rl.close();
  }
);

async function fetchAllRows(db: Database) {
  const rows = await db.all(`SELECT * FROM ceny_akcji ORDER BY data`);
  return rows;
}
