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
- Computes derived fields like `dataUnit` and `targets`
- Validates and normalizes slugs against esimdb's official slug list with override mappings
- Truncates names to meet character limits
- Skips rows with invalid data (e.g. bad price, bad country code) while logging issues with row numbers
- Uses standardized per-field processors to simplify and modularize data validation logic
- Aborts and returns 500 for fatal sheet or mapping errors

---

## ⚠️ Error Handling

- **Fatal errors** (e.g. fetch failure, malformed or missing required columns) return HTTP 500
- **Row-level issues** (e.g. invalid price or missing country code) are logged and skipped
- Slug validation uses the live esimdb slug list with fallback mappings; invalid slugs are logged per row
- Some internal errors (e.g. missing required column mapping) are explicitly treated as fatal and halt processing

---

## 🚀 Deployment Notes

- Works locally and can be deployed to platforms like Render
- Sheet ID is configured in `index.js`
- If Google Sheet column names change, update internal mappings accordingly
- The order of fields in `requiredFields` matters (e.g. `dataUnit` depends on `dataCap`)

---

## 📁 File Overview

### Root
- `index.js` — Express app and route handlers for the two endpoints
- `fetchAndParseCSV.js` — Orchestrates sheet fetching, parsing, row validation, and transformation

### utils/
- `csvUtils.js` — CSV parsing + field mapping (`FIELD_TO_SHEET_HEADER_MAP`, `VIRTUAL_FIELDS`)
- `validateRow.js` — Applies per-field validation using modular processors; handles row skipping and fatal errors
- `fieldProcessors.js` — Contains modular per-field processors with standardized interface (row, field, index); can return single values or objects
- `extractTargets.js` — Builds and validates slug target lists from coverage names and titles
- `truncateName.js` — Truncates long plan names at word boundaries (max 30 characters)
- `slugValidator.js` — Loads the official esimdb slug list and provides slug validation
- `slugOverridesMapping.js` — Custom mappings and corrections for country/region name inconsistencies
- `normalizeSlug.js` — Slug normalization logic used in target extraction

---

## 📝 Notes
- `coverageNames` (used for generating `targets`) is not included in the public API output but is required internally. Make sure the corresponding `"Location Name"` column exists in the sheet.
- Errors due to missing column mappings or missing sheet headers for required fields will abort the request (HTTP 500).
- Computed fields like `dataUnit` may also modify other values (e.g. rounding and converting `dataCap`).
- For clean project structure, helper logic is modularized under `utils/`.

