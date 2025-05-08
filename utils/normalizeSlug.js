import SLUG_OVERRIDES from "./slugOverridesMapping.js";

export default function normalizeSlug(regionName) {
  const base = regionName.toLowerCase().trim().replace(/\s+/g, "-");

  if (SLUG_OVERRIDES.hasOwnProperty(base)) {
    const mapped = SLUG_OVERRIDES[base];
    return mapped ? (Array.isArray(mapped) ? mapped : [mapped]) : [];
  }

  return [base];
}
