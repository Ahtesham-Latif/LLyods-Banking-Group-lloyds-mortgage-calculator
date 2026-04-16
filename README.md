# Lloyds Mortgage Calculator

A React-based mortgage calculator with a Lloyds-inspired green and black visual theme.

## Project Structure

- `public/index.html`: Root HTML shell.
- `src/App.js`: Main container wiring state, calculation, and UI composition.
- `src/App.css`: Theme tokens and responsive styling.
- `src/components/Header.js`: Lloyds branding and page heading.
- `src/components/Form.js`: Mortgage inputs (amount, rate, term).
- `src/components/Results.js`: Monthly repayment display.
- `src/utils/finance.js`: Mortgage repayment formula.
- `src/index.js`: React app entry point.

## Calculation Logic

`calculateMonthlyPayment(amount, annualRate, termYears)` computes the monthly repayment:

- Converts annual rate to monthly rate.
- Applies standard amortization formula when interest > 0.
- Falls back to simple principal split when interest is 0.
- Returns `0` for invalid or non-positive inputs.

## Run Locally

```bash
npm install
npm start
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
```
