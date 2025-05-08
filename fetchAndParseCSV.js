import fetch from "node-fetch";
import { parseCSV } from "./utils/csvUtils.js";
import validateRow from "./utils/validateRow.js";

export default async function fetchAndParseCSV(sheetUrl, requiredFields) {
    let records;
    let response;
    
    try {
        response = await fetch(sheetUrl);
    } catch (err) {
        throw new Error(`Fatal error fetching sheet: ${err.message}`);
    }
    if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    }

    try {
        const csvText = await response.text();
        records = parseCSV(csvText);
    } catch (err) {
        throw new Error(`Fatal error parsing sheet: ${err.message}`);
    }
    if (records.length === 0) {
        throw new Error("CSV appears to be empty or malformed.");
    }

    let result = [];
    for (let [index, row] of records.entries()) {
        const cleanedRow = validateRow(row, index, requiredFields);
        if (cleanedRow) {
            result.push(cleanedRow);
        }
    }

    return result;
}