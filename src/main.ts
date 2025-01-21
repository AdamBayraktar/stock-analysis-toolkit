import { openDb } from "../SQL/openDB.js";
import { createTable } from "../SQL/createTable.js";

const db = await openDb();
await createTable(db);
const result = await db.all(`SELECT * FROM ceny_akcji
    ORDER BY data`);
db.close();

// to count periods of price drop, one period is when price starts dropping and ends when price starts rising
let dropPeriodCount = 0;
let isPriceDropPeriod = false;
// to find biggest price drop
let biggestDailyPriceDrop = 0;
// to find biggest price drop period
let biggestPriceDropPeriod = 0;
let currentPriceDropPeriodStartPrice = 0;
// to find longest period of constant price
let longestConstantPricePeriod = 0;
let previousPrice = 0;
let currentConstantPricePeriod = 0;

function main() {
  result.forEach((row, index) => {
    let currentPrice = row.cena;

    // first iteration
    if (index === 0) {
      // set longest constant price period to 1, because there is at least one day
      longestConstantPricePeriod = 1;
      currentConstantPricePeriod = 1;
    }
    // remaining iterations
    else {
      if (currentPrice < previousPrice) {
        // set biggest price drop
        biggestDailyPriceDrop = Math.max(
          biggestDailyPriceDrop,
          previousPrice - currentPrice
        );
        // reset current constant price period
        currentConstantPricePeriod = 1;

        // if it's the first day of price drop period then increment drop period count
        if (!isPriceDropPeriod) {
          isPriceDropPeriod = true;
          currentPriceDropPeriodStartPrice = previousPrice;
          dropPeriodCount++;
        }
        biggestPriceDropPeriod = Math.max(
          biggestPriceDropPeriod,
          currentPriceDropPeriodStartPrice - currentPrice
        );
      } else if (currentPrice === previousPrice) {
        currentConstantPricePeriod++;
        longestConstantPricePeriod = Math.max(
          longestConstantPricePeriod,
          currentConstantPricePeriod
        );
      } else if (currentPrice > previousPrice) {
        if (longestConstantPricePeriod > 0) {
          dropPeriodCount++;
          longestConstantPricePeriod = 0;
        }
        isPriceDropPeriod = false;
        // reset current constant price period
        currentConstantPricePeriod = 1;
      }
    }
    // set previous price for the next iteration
    previousPrice = row.cena;
  });
  biggestDailyPriceDrop = +biggestDailyPriceDrop.toFixed(2);
  biggestPriceDropPeriod = +biggestPriceDropPeriod.toFixed(2);
  console.log(`biggestDailyPriceDrop: ${biggestDailyPriceDrop}`);
  console.log(`biggestPriceDropPeriod: ${biggestPriceDropPeriod}`);
  console.log(`longestConstantPricePeriod: ${longestConstantPricePeriod}`);
  console.log(`dropPeriodCount: ${dropPeriodCount}`);
}

main();
