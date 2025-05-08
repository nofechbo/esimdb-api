import fetch from "node-fetch";
import { parseCSV } from "./utils/csvUtils.js";
import validateRow from "./utils/validateRow.js";

export default async function fetchAndParseCSV(sheetUrl, requiredFields) {
    let records;
    
    try {
        const response = await fetch(sheetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
        }

        const csvText = await response.text();
        records = parseCSV(csvText);
        if (records.length === 0) {
            throw new Error("CSV appears to be empty or malformed.");
        }

    } catch (err) {
        throw new Error(`Fatal error fetching/parsing sheet: ${err.message}`);
    }

    return records.map((row, index) => {
        const { isValid, cleanedRow } = validateRow(row, index, requiredFields);
        if (!isValid) return null;

        const output = {};
        for (const field of requiredFields) {
            if (field in cleanedRow) {
            output[field] = cleanedRow[field];
            }
        }
        return output;

    }).filter(Boolean); //keep only successful rows
}