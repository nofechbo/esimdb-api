import { FIELD_TO_SHEET_HEADER_MAP, VIRTUAL_FIELDS } from "./csvUtils.js";
import { processValidity,
         processDataCap, 
         processDataUnit,
         processPrices,
         processCoverages,
         processTargets,
         processLink,
         processName
       } from "./fieldProcessors.js";


// Unified processor lookup
const FIELD_PROCESSORS = {
    validity: processValidity,
    dataCap: processDataCap,
    dataUnit: processDataUnit,
    prices: processPrices,
    coverages: processCoverages,
    name: processName,
    targets: processTargets,
    link: processLink
};

export default function validateRow(row, index, requiredFields) {
    const cleanedRow = {};

    for (const field of requiredFields) {
        const column = FIELD_TO_SHEET_HEADER_MAP[field];
        
        if ((!VIRTUAL_FIELDS.has(field)) && 
            (column === undefined || !(column in row))) {
            throw new Error(`No column mapping for required field "${field}"`);
        }

        try { 
            const processor = FIELD_PROCESSORS[field];

            if (!processor) {
                // No processor registered → fallback to raw value (i.e planName)
                cleanedRow[field] = row[column];
                continue;
            }

            const result = processor(row, field, index);

            if (typeof result === "object" && result !== null && !Array.isArray(result)) {
                Object.assign(cleanedRow, result); // e.g. { dataCap, dataUnit }
            } else {
                cleanedRow[field] = result;
            }

        } catch (err) {
            if (err.fatal) throw err;
            console.warn(`Skipping row ${index + 2}: ${err.message}`);
            return { isValid: false }; //skip row
        }
    }

    return { isValid: true, cleanedRow };
}
