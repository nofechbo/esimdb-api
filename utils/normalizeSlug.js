import SLUG_OVERRIDES from "./slugOverridesMapping.js";

export default function normalizeSlug(regionName) {
  const slug = regionName.toLowerCase().trim().replace(/\s+/g, "-");

  if (SLUG_OVERRIDES.hasOwnProperty(slug)) {
    return SLUG_OVERRIDES[slug];
  }

  return slug;
}
