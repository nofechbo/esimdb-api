export function truncateName(input, maxLength = 30) {
    if (input.length <= maxLength) return input;
    if (!input || typeof input !== "string") {
      throw new Error("Missing or invalid 'Name' value");
    }
  
    const words = input.split(/[\s\-():/]+/);  // splits on common separators but preserves digits
    let result = "";
  
    for (const word of words) {
      if (!word) continue;
      const next = result ? `${result} ${word}` : word;
      if (next.length > maxLength) break;
      result = next;
    }
  
    return result || "View Plan";
  }
  