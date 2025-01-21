# Stock Analysis Program

This project is a TypeScript-based stock analysis program that reads stock price data either from a SQLite database (which first creates from CSV and then uses it) or a CSV file and computes various metrics, such as:

- The largest daily price drop.
- The number of price drop periods.
- The largest price drop period and its duration.
- The longest period of constant price.

## Prerequisites

- Node.js (v16 or higher recommended)

## Installation and Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/AdamBayraktar/stock-analysis-toolkit
   cd stock-analysis-toolkit
   ```

2. **Install Dependencies**:
   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

3. Usage

Run the main script using `npx` and `tsx`:

```bash
npx tsx src/main.ts
```

You will be prompted to choose the data source:

- Enter `DB` to analyze data from the SQLite database.
- Enter anything else to analyze data from the CSV file.

## Dependencies

- `sqlite` and `sqlite3`: For interacting with the SQLite database.
- `csv-parser`: For parsing CSV files.
- `readline`: For interactive user input.
- `tsx`: For running TypeScript files without compiling.

## Notes

- The `ceny_akcji.csv` file must be in the root directory if analyzing data from CSV.

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.
