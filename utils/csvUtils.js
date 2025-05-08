import { parse } from "csv-parse/sync";

// Internal mapping: esimdb field → Google Sheet header
export const FIELD_TO_SHEET_HEADER_MAP = {
    validity: "Days",
    dataCap: "GB",
    prices: "Price",
    planName: "Name",
    coverages: "Country Codes",
    name: "Name",
    link: "Link",
    coverageNames: "Location Name"
};

// These fields are computed, not mapped directly to the sheet
export const VIRTUAL_FIELDS = new Set(["dataUnit", "targets"]);


export function getFieldValue(row, internalFieldName) {
    const header = FIELD_TO_SHEET_HEADER_MAP[internalFieldName];
    return row[header] ?? null;
}

export function parseCSV(text) {
    return parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });
}