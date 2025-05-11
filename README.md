# eSIMDB API Integration

This is a production-ready backend service that fetches eSIM plan data from a public Google Sheet and transforms it into a JSON format compatible with [esimdb.com](https://esimdb.com).

Built with Node.js and Express, it exposes two API endpoints for integration:
- `/data-plans-for-esimdb` — returns structured plan data
- `/links-for-esimdb` — returns plan links and validated target slugs

Includes robust validation, slug normalization, name truncation, and modular utility logic. Fully deployable on Render with logging support.

---

## 🔧 Tech Stack

- Node.js (ESM)
- Express
- `node-fetch` for HTTP requests
- `csv-parse` for parsing CSV
- Postman (for local testing and endpoint debugging)

---

## 🧩 Key Features

- Parses structured CSV data from a Google Sheet
- Maps sheet fields to expected JSON fields
- Computes derived fields like `targets`
- Validates and normalizes slugs against esimdb's official slug list with override mappings
- Ensures countries without operators are still included in results (with no networks)
- Truncates names to meet character limits
- Skips only rows with invalid required fields (e.g. bad price or malformed code) while logging issues with row numbers
- Uses standardized per-field processors to simplify and modularize data validation logic
- Aborts and returns 500 for fatal sheet or mapping errors

---

## ⚠️ Error Handling

- **Fatal errors** (e.g. fetch failure, malformed or missing required columns) return HTTP 500
- **Row-level issues** (e.g. invalid price or missing country code) are logged and skipped
- Slug validation uses the live esimdb slug list with fallback mappings; invalid slugs are logged per row

---

## 🚀 Deployment Notes

- Works locally and can be deployed to platforms like Render
- Sheet ID is configured in `index.js`
- If Google Sheet column names change, update internal mappings accordingly

---

## 🧪 Testing
- Use Postman to test both endpoints with live sheet data
- Add console.log or console.warn in processors to trace row-level issues
- To simulate missing headers or malformed data, edit the Sheet directly and re-fetch

---

## 📁 File Overview

### Root
- `index.js` — Express app and route handlers for the two endpoints
- `fetchAndParseCSV.js` — Fetches, parses, and validates the sheet rows using required field logic

### utils/
- `csvUtils.js` — Central mapping for field headers and processors; includes FIELDS_DATA and utility functions for parsing and normalization
- `validateRow.js` — Applies per-field validation using modular processors; handles row skipping and fatal errors
- `fieldProcessors.js` — Modular per-field processors (e.g. processPrice, processCoverages, etc.) with consistent interfaces
- `getCoveragesAndNetworks.js` — Parses country codes and mobile network data into structured coverage arrays
- `extractSlugTargets.js` — Converts location names and plan titles into validated esimdb slug targets
- `truncateName.js` — Trims plan names to length limits while preserving meaning
- `slugValidator.js` — Loads official esimdb slug list and validates or normalizes against it
