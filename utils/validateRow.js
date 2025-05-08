import { FIELDS_DATA } from "./csvUtils.js";

export default function validateRow(row, index, requiredFields) {
    const cleanedRow = {};

    for (const field of requiredFields) {
        let header;

        if (!(field in FIELDS_DATA)) {
            throw new Error(`No header mapping for required field "${field}"`);
        }

        header = FIELDS_DATA[field].header;
        if (header && !(header in row)) {
            throw new Error(`missing header: "${header}"`);
        }

        try { 
            const rawValue = header ? row[header] : null;

            cleanedRow[field] = FIELDS_DATA[field].processor(row, rawValue, field, index);
        } catch (err) {
            console.warn(`Skipping row ${index + 2}: ${err.message}`);
            return null; 
        }
    }

    return cleanedRow;
}
