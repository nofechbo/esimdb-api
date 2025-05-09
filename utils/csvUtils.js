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

        
export function parseCSV(text) {
    return parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });
}

// Internal mapping: esimdb field → Google Sheet header + processor
export const FIELDS_DATA = {
    validity: { header:"Days", processor: processValidity },
    dataCap: { header: "GB", processor: processDataCap },
    prices: { header: "Price", processor: processPrices },
    planName: { header: "Name", processor: processPlanName },
    coverages: { header: "Country Codes", processor: processCoverages },
    name: { header: "Name", processor: processName },
    link: { header: "Link", processor: processLink },
    targets: { header: "Location Name", processor: processTargets },
    dataUnit: { header: null, processor: processDataUnit} //field is computed, not retrieved from sheet
};

export const SLUG_OVERRIDES = {   
    "aaland-islands": "aland-islands",
    "brunei-darussalam": "brunei",
    "china-mainland": "china",
    "congo": "republic-of-the-congo",
    "cote-d'ivoire": "ivory-coast",
    "czech-republic": "czechia",
    "democratic-republic-of-the-congo": "dr-congo",
    "england": "uk",
    "french-west-indies": "martinique",
    "gulf-region": null,
    "hong-kong-(china)": "hong-kong",
    "kyrgyzstan": "kyrgyz",
    "macao-(china)": "macau",
    "northern-cyprus": "turkey",
    "north-ireland": "uk",
    "scotland": "uk",
    "swaziland": "eswatini",
    "taiwan-(china)": "taiwan",
    "united-arab-emirates": "uae",
    "united-kingdom": "uk",
    "united-states": "usa",
    "virgin-islands--british": "british-virgin-islands",
    "virgin-islands---us": "united-states-virgin-islands",
    "wales": "uk",
    "western-samoa": "samoa",    
};