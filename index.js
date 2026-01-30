import "dotenv/config";
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
    "dataUnit",
    "prices",
    "planName",
    "coverages",
    "dataCapPer",
    "reducedSpeed",
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

const REF_CODE = process.env.REF_CODE;

function appendRefToLink(link) {
    if (!REF_CODE) return link;
    const separator = link.includes("?") ? "&" : "?";
    return `${link}${separator}ref=${REF_CODE}`;
}

async function getLinksData() {
    const data = await fetchAndParseCSV(SHEET_URL, requiredLinkFields);
    return [
        ...new Map(
            data.map(item => {
                const cleanedName = item.name.replace(/^(.*?)\s*-.*/, "$1").trim();
                return [cleanedName, { ...item, name: cleanedName }];
            })
        ).values()
    ];
}

app.get("/links", async (req, res) => {
    try {
        const data = await getLinksData();
        if (handleEmpty(res, data)) return;
        res.json(data);
    } catch (err) {
        console.error("Error fetching or parsing CSV:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/links-for-esimdb", async (req, res) => {
    try {
        const data = await getLinksData();
        if (handleEmpty(res, data)) return;
        const dataWithRef = data.map(item => ({
            ...item,
            link: appendRefToLink(item.link)
        }));
        res.json(dataWithRef);
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


