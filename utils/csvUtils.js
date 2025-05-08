import { parse } from "csv-parse/sync";
import { processValidity,
    processDataCap, 
    processDataUnit,
    processPrices,
    processPlanName,
    processCoverages,
    processTargets,
    processLink,
    processName
  } from "./fieldProcessors.js";

// Internal mapping: esimdb field → Google Sheet header
export const FIELDS_DATA = {
    validity: { header:"Days", processor: processValidity },
    dataCap: { header: "GB", processor: processDataCap },
    prices: { header: "Price", processor: processPrices },
    planName: { header: "Name", processor: processPlanName },
    coverages: { header: "Country Codes", processor: processCoverages },
    name: { header: "Name", processor: processName },
    link: { header: "Link", processor: processLink },
    targets: { header: "Location Name", processor: processTargets },
    dataUnit: { header: null, processor: processDataUnit}
};

// These fields are computed, not mapped directly to the sheet
export const VIRTUAL_FIELDS = new Set(["dataUnit"]);


export function getFieldValue(row, internalFieldName) {
    const header = FIELDS_DATA[internalFieldName];
    return row[header] ?? null;
}

export function parseCSV(text) {
    return parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });
}