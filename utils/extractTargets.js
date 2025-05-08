import normalizeSlug from "./normalizeSlug.js";
import { assertValidSlug } from "./slugValidator.js";

/**
 * Extracts a list of target slugs based on coverage region names and plan titles.
 * 
 * @param {string} coverageNames - A comma-separated list of countries or regions
 * @param {string} title - A human-readable plan name
 * @param {number} [rowIndex] - Sheet row index (1-based, e.g. row 2 = first row after header)
 * @returns {string[]} - A list of valid slugs (invalid ones skipped)
 */

export default function extractTargets(coverageNames, title, rowIndex = null) {
  const targets = new Set();
  let coverageList = [];

  // From coverage names
  if (coverageNames) {
    coverageList = coverageNames
      .split(",")
      .map(name => name.trim())
      .filter(Boolean);

    for (const name of coverageList) {
      normalizeSlug(name).forEach(slug => {
        try {
          assertValidSlug(slug, name);
          targets.add(slug);
        } catch (err) {
          console.warn(`Skipped slug "${slug}" (from "${name}") on row ${rowIndex ?? "?"}: ${err.message}`);
        }
      });
    }
  }

  // From plan title (region)
  if (coverageList.length > 1 && title) {
    const match = title.trim().match(/^([A-Za-z]+(?:\s+[A-Za-z]+)?)/);
    if (match) {
      normalizeSlug(match[1]).forEach(slug => {
        try {
          assertValidSlug(slug, match[1]);
          targets.add(slug);
        } catch (err) {
          console.log(`Skipped slug "${slug}" (from "${match[1]}") on row ${rowIndex ?? "?"}: ${err.message}`);
        }
      });
    }
  }

  const result = Array.from(targets);
  if (result.length === 0) {
    throw new Error("No valid slugs generated");
  }

  return result;
}
