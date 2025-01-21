import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";

// you would have to import / invoke this in another file
export async function openDb(): Promise<Database> {
  return open({
    filename: "database.db",
    driver: sqlite3.Database,
  });
}
