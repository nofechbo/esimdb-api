import { FIELDS_DATA } from "./csvUtils.js";
import extractTargets from "./extractTargets.js";
import { truncateName } from "./truncateName.js";

export function processValidity(row, rawValue, field, index) {
    const days = parseInt(rawValue);
    if (isNaN(days)) throw new Error(`Invalid validity: "${rawValue}"`);
    return days;
}

export function processDataCap(row, rawValue, field, index) {
    const cap = parseInt(rawValue);
    if (isNaN(cap)) throw new Error(`Invalid dataCap: "${rawValue}"`);
    return cap;
}

export function processDataUnit(row, rawValue, field, index) {
    return "GB";
}

export function processPlanName(row, rawValue, field, index) {
    return rawValue;
}
  
export function processPrices(row, rawValue, field, index) {
    const price = parseFloat(rawValue.replace(",", "."));
    if (isNaN(price)) throw new Error(`Invalid price: "${rawValue}"`);
    return { USD: price};
}

export function processCoverages(row, rawValue, field, index) {
    const validCodes = rawValue
        .split(",")
        .map(code => code.trim())
        .filter(code => {
            if (code.length !== 2) {
                return false;
            }
            return true;
        });

    if (validCodes.length === 0) throw new Error("No valid country codes found");
    return validCodes.map(code => ({ code }));
}

export function processTargets(row, rawValue, field, index) { 
    const coverageNames = rawValue;
    const title = row[FIELDS_DATA["planName"].header];
  
    return extractTargets(coverageNames, title, index + 2);
}
    
export function processName(row, rawValue, field, index) {
    return truncateName(rawValue);
}

export function processLink(row, rawValue, field, index) {
    const trimmed = typeof rawValue === "string" ? rawValue.trim() : "";
    return trimmed || "https://pingwe.com/";
  }
  