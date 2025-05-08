import { FIELD_TO_SHEET_HEADER_MAP } from "./csvUtils.js";
import extractTargets from "./extractTargets.js";
import { truncateName } from "./truncateName.js";

function fatal(message) {
    const err = new Error(message);
    err.fatal = true;
    return err;
}

export function processValidity(row, field, index) {
    const rawValue = row[FIELD_TO_SHEET_HEADER_MAP[field]];
    const days = parseInt(rawValue, 10);
    if (isNaN(days)) throw new Error(`Invalid validity: "${rawValue}"`);
    return days;
}

export function processDataCap(row, field, index) {
    const rawValue = row[FIELD_TO_SHEET_HEADER_MAP[field]];
    const cap = parseFloat(rawValue);
    if (isNaN(cap)) throw new Error(`Invalid dataCap: "${rawValue}"`);
    return cap;
}

export function processDataUnit(row, field, index) {
    const dataCap = row.dataCap;
    if (dataCap < 1) {
        return {
        dataCap: Math.round(dataCap * 1000),
        dataUnit: "MB"
        };
    }
    return {
        dataCap,
        dataUnit: "GB"
    };
}
  
export function processPrices(row, field, index) {
    const rawValue = row[FIELD_TO_SHEET_HEADER_MAP[field]];
    const price = parseFloat(rawValue.replace(",", "."));
    if (isNaN(price)) throw new Error(`Invalid price: "${rawValue}"`);
    return { USD: price};
}

export function processCoverages(row, field, index) {
    const rawValue = row[FIELD_TO_SHEET_HEADER_MAP[field]];
    const validCodes = rawValue
        .split(",")
        .map(code => code.trim())
        .filter(code => {
            if (code.length !== 2) {
                console.warn(`Row ${index + 2}: Invalid country code "${code}"`);
                return false;
            }
            return true;
        });

    if (validCodes.length === 0) throw new Error("No valid country codes found");
    return validCodes.map(code => ({ code }));
}

export function processTargets(row, field, index) {
    const key = FIELD_TO_SHEET_HEADER_MAP["coverageNames"];
    if (!key || !(key in row)) {
      throw fatal(`Missing or unmapped column for "coverageNames" ("Location Name")`);
    }
  
    const coverageNames = row[key];
    const title = row[FIELD_TO_SHEET_HEADER_MAP["planName"]];
  
    return extractTargets(coverageNames, title, index + 2);
}
    
export function processName(row, field, index) {
    const rawValue = row[FIELD_TO_SHEET_HEADER_MAP[field]];
    return truncateName(rawValue);
}

export function processLink(row, field, index) {
    const rawValue = row[FIELD_TO_SHEET_HEADER_MAP[field]];
    const trimmed = typeof rawValue === "string" ? rawValue.trim() : "";
    return trimmed || "https://pingwe.com/";
  }
  