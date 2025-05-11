import { FIELDS_DATA, specialRequiredHeaders } from "./csvUtils.js";

const skip_headers = 2;

export default function validateRow(row, index, requiredFields) {
    const cleanedRow = {};

    for (const hdr of specialRequiredHeaders) {
        if (!(hdr in row)) {
            throw new Error(`Missing required column: ${hdr}`);
        }
    }

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
            const processor = FIELDS_DATA[field].processor;
            cleanedRow[field] = processor(row, rawValue);

        } catch (err) {
            console.warn(`Skipping row ${index + skip_headers}: ${err.message}`);
            return null; 
        }
    }

    return cleanedRow;
}
