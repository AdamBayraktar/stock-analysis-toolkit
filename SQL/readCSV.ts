import csv from "csv-parser";
import fs from "fs";
import Stock from "../models/interfaces/Stock.interface.js";

const csvFilePath = "ceny_akcji.csv";

export async function readCSV(): Promise<Stock[]> {
  return new Promise((resolve, reject) => {
    const results: Stock[] = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        const stockData: Stock = {
          date: row[1],
          price: row[2],
          currency: row[3],
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
