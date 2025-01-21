import Stock from "../interfaces/Stock.interface.js";

export default class StockAnalysis {
  // Properties to hold results
  dropPeriodCount = 0;
  biggestDailyPriceDrop = 0;
  biggestPriceDropPeriod = 0;
  biggestPriceDropPeriodDays = 0;
  longestConstantPricePeriod = 0;

  // Internal state for calculations
  private isPriceDropPeriod = false;
  private currentPriceDropPeriodStartPrice = 0;
  private currentPriceDropPeriodDays = 0;
  private currentConstantPricePeriod = 0;
  private previousPrice = 0;

  constructor(private data: Stock[]) {
    if (!this.data || this.data.length === 0) {
      throw new Error("Brak danych do analizy.");
    }
    // Sort by date before processing
    this.data.sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );
    this.data = this.data.map((row) => ({
      ...row,
      cena: parseFloat(`${row.cena}`),
    }));
    this.compute();
  }

  private compute() {
    this.data.forEach((row, index) => {
      const currentPrice = row.cena;

      if (index === 0) {
        // set longest constant price period to 1, because there is at least one day
        this.longestConstantPricePeriod = 1;
        this.currentConstantPricePeriod = 1;
      } else {
        if (currentPrice < this.previousPrice) {
          // Update biggest daily price drop
          this.biggestDailyPriceDrop = Math.max(
            this.biggestDailyPriceDrop,
            this.previousPrice - currentPrice
          );

          // Reset current constant price period
          this.currentConstantPricePeriod = 1;

          // Handle price drop period
          if (!this.isPriceDropPeriod) {
            this.isPriceDropPeriod = true;
            this.currentPriceDropPeriodStartPrice = this.previousPrice;
            this.dropPeriodCount++;
            this.currentPriceDropPeriodDays = 1;
          } else {
            this.currentPriceDropPeriodDays++;
          }

          // Update biggest price drop period
          const currentDrop =
            this.currentPriceDropPeriodStartPrice - currentPrice;
          if (currentDrop > this.biggestPriceDropPeriod) {
            this.biggestPriceDropPeriod = currentDrop;
            this.biggestPriceDropPeriodDays = this.currentPriceDropPeriodDays;
          }
        } else if (currentPrice === this.previousPrice) {
          // Handle constant price period
          this.currentConstantPricePeriod++;
          this.longestConstantPricePeriod = Math.max(
            this.longestConstantPricePeriod,
            this.currentConstantPricePeriod
          );
        } else if (currentPrice > this.previousPrice) {
          // Price increased
          this.isPriceDropPeriod = false;
          this.currentConstantPricePeriod = 1; // Reset constant price period
        }
      }

      // Update previous price
      this.previousPrice = currentPrice;
    });

    // Round off results for better readability
    this.biggestDailyPriceDrop = +this.biggestDailyPriceDrop.toFixed(2);
    this.biggestPriceDropPeriod = +this.biggestPriceDropPeriod.toFixed(2);
  }

  // Method to get a summary of all results
  getSummary() {
    return {
      dropPeriodCount: this.dropPeriodCount,
      biggestDailyPriceDrop: this.biggestDailyPriceDrop,
      biggestPriceDropPeriod: this.biggestPriceDropPeriod,
      biggestPriceDropPeriodDays: this.biggestPriceDropPeriodDays,
      longestConstantPricePeriod: this.longestConstantPricePeriod,
    };
  }

  consoleSummary() {
    console.log();
    console.log("Podsumowanie analizy cen akcji:");
    console.log("--------------------");
    console.log(
      `Największy dzienny spadek wartości: ${this.biggestDailyPriceDrop}`
    );
    console.log(`Ilość okresów spadków cen: ${this.dropPeriodCount}`);
    console.log("Okres spadku, w którym cena akcji spadła najbardziej:");
    console.log(`   Dni: ${this.biggestPriceDropPeriodDays}`);
    console.log(`   Łączna wartość spadku: ${this.biggestPriceDropPeriod}`);
    console.log(
      `Najdłuższy okres niezmiennej ceny: ${this.longestConstantPricePeriod}`
    );
  }
}
