import fetch from "node-fetch";

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
        throw new Error(`Invalid slug "${slug}" (from "${originalInput}") — not in esimdb list`);
    }
}

