import express from "express";
import fetchAndParseCSV from "./fetchAndParseCSV.js";
import { initializeSlugValidator } from "./utils/slugValidator.js";

const app = express();
const PORT = process.env.PORT || 3000;

const sheetId = "1Zc8xwu1sZul691Yx3O_-KlNRZswoz4yudN8qsWuw0TM";
//const sheetId = "1F0OYAlu89VWT4qmQrhh2H7qfzjvHLoL22IcUFPkNt4Y"; //test sheet
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

const requiredDataPlanFields = [
    "validity",
    "dataCap",
    "dataUnit", //dataCap must come before dataUnit because dataUnit depends on it
    "prices",
    "planName",
    "coverages"
];  

app.get("/data-plans-for-esimdb", async (req, res) => {
    try {
        const data = await fetchAndParseCSV(SHEET_URL, requiredDataPlanFields);
        if (handleEmpty(res, data)) return;
        res.json(data);
    } catch (err) {
        console.error('Error fetching or parsing CSV:', err);
        res.status(500).json({ error: err.message });
    }
});

const requiredLinkFields = [
    "name",
    "link",
    "targets"
];

app.get("/links-for-esimdb", async (req, res) => {
    try {
        const data = await fetchAndParseCSV(SHEET_URL, requiredLinkFields);
        if (handleEmpty(res, data)) return;
        res.json(data);
    } catch (err) {
        console.error("Error fetching or parsing CSV:", err);
        res.status(500).json({ error: err.message });
    }
});

await initializeSlugValidator();

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});


function handleEmpty(res, data) {
    if (data.length === 0) {
        console.error("Fatal error: No valid data rows found in sheet.");
        res.status(500).json({ error: "No valid data rows found in sheet." });
        return true;
    }
    return false;
}


