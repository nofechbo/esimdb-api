import { FIELDS_DATA } from "./csvUtils.js";
import extractSlugTargets from "./extractSlugTargets.js";
import { truncateName } from "./truncateName.js";

const PLAN_NAME_LIMIT = 35;
const LINK_NAME_LIMIT = 30;

export function processValidity(row, rawValue) {
    const days = parseInt(rawValue);
    if (isNaN(days)) throw new Error(`Invalid validity: "${rawValue}"`);
    return days;
}

export function processDataCap(row, rawValue) {
    const cap = parseInt(rawValue);
    if (isNaN(cap)) throw new Error(`Invalid dataCap: "${rawValue}"`);
    return cap;
}

export function processDataUnit(row, rawValue) {
    return "GB";
}

export function processPlanName(row, rawValue) {
    return truncateName(rawValue, PLAN_NAME_LIMIT);
}
  
export function processPrices(row, rawValue) {
    const price = parseFloat(rawValue.replace(",", "."));
    if (isNaN(price)) throw new Error(`Invalid price: "${rawValue}"`);
    return { USD: price};
}

export function processCoverages(row, rawValue) {
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

export function processTargets(row, rawValue) { 
    const coverageNames = rawValue;
    const title = row[FIELDS_DATA["planName"].header];
  
    return Array.from(extractSlugTargets(coverageNames, title));
}
    
export function processName(row, rawValue) {
    return truncateName(rawValue, LINK_NAME_LIMIT);
}

export function processLink(row, rawValue) {
    const trimmed = typeof rawValue === "string" ? rawValue.trim() : "";
    return trimmed || "https://pingwe.com/"; //fallback to homepage if no link is found
  }
  