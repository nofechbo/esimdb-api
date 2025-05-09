import fetch from "node-fetch";
import { SLUG_OVERRIDES } from "./csvUtils.js";

let OFFICIAL_SLUGS = null;

export async function initializeSlugValidator() {
    const res = await fetch("https://esimdb.com/api/utils/link-targets");
    const data = await res.json();

    OFFICIAL_SLUGS = new Set(data.map(entry => entry.target));
    console.log(`Loaded ${OFFICIAL_SLUGS.size} official esimdb slugs`);
}

export function assertValidSlug(slug, originalInput) {
    if (!OFFICIAL_SLUGS) {
        throw new Error("Slug list not initialized");
    }

    if (!OFFICIAL_SLUGS.has(slug)) {
        throw new Error(`Invalid slug "${slug}" — not in esimdb list`);
    }
}

export function normalizeSlug(regionName) {
    const slug = regionName.toLowerCase().trim().replace(/\s+/g, "-");

    if (SLUG_OVERRIDES.hasOwnProperty(slug)) {
        return SLUG_OVERRIDES[slug];
    }

    return slug;
}

