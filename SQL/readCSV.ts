import csv from "csv-parser";
import fs from "fs";
import Stock from "../models/interfaces/Stock.interface.js";

export async function readCSV(
  csvFilePath = "ceny_akcji.csv"
): Promise<Stock[]> {
  return new Promise((resolve, reject) => {
    const results: Stock[] = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        const stockData: Stock = {
          data: row[1],
          cena: row[2],
          waluta: row[3],
        };
        results.push(stockData);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
