# eSIMDB API Integration

**A live Node.js integration service that transforms eSIM plan data from Google Sheets into the structured format required by eSIMDB.**

The service fetches plan data from a public Google Sheet, validates and normalizes each record, and exposes two HTTP endpoints used for eSIMDB integration.

> The service is currently deployed and running on Render.

## Project highlights

* **Google Sheets ingestion** — fetch plan data directly from a published CSV source.
* **eSIMDB-compatible transformation** — map internal plan fields into the structures expected by eSIMDB.
* **Slug validation** — validate destinations against eSIMDB's supported slug list and apply known fallback mappings.
* **Coverage parsing** — convert country and network data into structured coverage objects.
* **Field-level validation** — process prices, codes, titles, destinations, and other values through reusable validation functions.
* **Graceful row handling** — skip individual malformed rows while allowing valid data to continue processing.
* **Fatal schema protection** — reject requests when required sheet structure or upstream data cannot be processed safely.
* **Name normalization** — ensure generated plan names comply with external integration limits.

## API endpoints

### `GET /data-plans-for-esimdb`

Returns transformed eSIM plan data in the structure required by eSIMDB.

The processing pipeline:

1. Fetches the configured Google Sheet as CSV.
2. Parses the CSV into records.
3. Maps sheet columns to internal fields.
4. Validates and normalizes each row.
5. Generates coverage, network, and destination information.
6. Returns the resulting plan data as JSON.

### `GET /links-for-esimdb`

Returns plan links and validated target slugs used by eSIMDB.

Destination names are checked against eSIMDB's supported slugs before being included.

## Technical architecture

```mermaid
flowchart LR
    Sheet[Published Google Sheet] --> Fetch[CSV fetch]
    Fetch --> Parser[CSV parser]
    Parser --> Validation[Field validation & normalization]

    Validation --> Coverage[Coverage & network processing]
    Validation --> Slugs[eSIMDB slug validation]
    Validation --> Names[Plan-name normalization]

    Coverage --> Plans[Plan transformation]
    Slugs --> Plans
    Names --> Plans

    Plans --> DataAPI[/data-plans-for-esimdb]
    Plans --> LinkAPI[/links-for-esimdb]

    SlugSource[eSIMDB supported slugs] --> Slugs
```

The integration separates CSV retrieval, field processing, row validation, coverage handling, slug normalization, and output generation into focused utility modules.

This keeps external-format requirements isolated from the main Express route handlers and makes individual transformation rules easier to modify when the source sheet or eSIMDB requirements change.

## Technology stack

| Area        | Technologies  |
| ----------- | ------------- |
| Runtime     | Node.js       |
| API         | Express       |
| Modules     | ES Modules    |
| HTTP        | `node-fetch`  |
| CSV parsing | `csv-parse`   |
| Source data | Google Sheets |
| Deployment  | Render        |

## Running locally

### Clone the repository

```bash
git clone https://github.com/nofechbo/esimdb-api.git
cd esimdb-api
```

### Install dependencies

```bash
npm install
```

### Configure the environment

Copy the example file:

```bash
cp .env.example .env
```

Fill in any required configuration values.

### Start the service

```bash
npm start
```

You can then test the API endpoints using a browser, curl, Postman, or another HTTP client.

## Error handling

The service distinguishes between failures that invalidate the entire request and problems affecting only individual rows.

### Fatal errors

Examples include:

* Unable to fetch the source sheet
* Missing required columns
* Invalid source structure
* Errors that prevent reliable transformation

These result in an HTTP `500` response.

### Row-level errors

Examples include:

* Invalid prices
* Missing or malformed country codes
* Invalid field values
* Unsupported destination slugs

Problematic rows can be logged and skipped while valid rows continue through the pipeline.

## Repository structure

```text
esimdb-api/
├── index.js                    # Express application and API routes
├── fetchAndParseCSV.js         # Fetches and parses source CSV data
├── utils/
│   ├── csvUtils.js             # Field mappings and CSV utilities
│   ├── validateRow.js          # Row-level validation
│   ├── fieldProcessors.js      # Individual field processors
│   ├── getCoveragesAndNetworks.js
│   ├── extractSlugTargets.js
│   ├── truncateName.js
│   └── slugValidator.js
├── .env.example
├── package.json
└── README.md
```

## Engineering decisions demonstrated

* **Transformation pipeline:** external source data moves through explicit parsing, validation, normalization, and output stages.
* **Partial-failure tolerance:** one malformed plan does not invalidate an otherwise usable data feed.
* **Schema validation:** structural source errors fail early rather than generating unreliable integration output.
* **Modular field processors:** validation rules remain isolated instead of accumulating inside route handlers.
* **External taxonomy validation:** destination values are reconciled against eSIMDB's supported target slugs before publishing.
* **Operational deployment:** the service is deployed on Render and used as a live integration rather than only as a local proof of concept.

## Deployment

The service is currently deployed on **Render**.

The Google Sheet ID and other configuration values are supplied through the application's environment or source configuration.

If the upstream Sheet column names or eSIMDB integration requirements change, the corresponding field mappings and processors should be updated accordingly.
