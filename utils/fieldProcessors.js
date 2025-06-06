import { FIELDS_DATA } from "./csvUtils.js";
import extractSlugTargets from "./extractSlugTargets.js";
import { truncateName } from "./truncateName.js";
import { getCoveragesAndNetworks } from "./getCoveragesAndNetworks.js";

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
    const networks = row["Operators"] ?? "";
    return getCoveragesAndNetworks(rawValue, networks);
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

export function processDataCapPer(row, rawValue) {
    if (typeof rawValue !== "string") {
        return null;
    }

    const VALID_PERIODS = ["day", "week", "month"];
    const capPer = rawValue.trim().toLowerCase();
    
    return VALID_PERIODS.includes(capPer) ? capPer : null;
}

export function processReducedSpeed(row, rawValue) {   
    const kbps = parseInt(rawValue);

    return isNaN(kbps) ? null : kbps;
}