import { assertValidSlug, normalizeSlug } from "./slugValidator.js";

export default function extractSlugTargets(locationsString, planName) {
  const validSlugs = new Set();
  let namesList = [];

  namesList = locationsString
    .split(",")
    .map(name => name.trim())
    .filter(Boolean);

  //extract region name from planName only if there were multiple locations,
  //assuming 1-2 first words are a region name
  if (namesList.length > 1) {
    const match = planName.trim().match(/^([A-Za-z]+(?:\s+[A-Za-z]+)?)/);
    if (match) {
      namesList.push(match[1]);
    }
  }

  for (const name of namesList) {
    try {    
      const slug = normalizeSlug(name);
      assertValidSlug(slug, name);
      validSlugs.add(slug);
    } catch (err) {
      console.log(`Skipped slug: ${err.message}`);
    }
  }

  if (validSlugs.size === 0) {
    throw new Error("No valid slugs generated");
  }

  return validSlugs;
}
