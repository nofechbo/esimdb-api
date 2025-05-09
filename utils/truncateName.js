export function truncateName(input, maxLength) {
    if (input.length <= maxLength) return input;

    if (!input || typeof input !== "string") {
      throw new Error("Missing or invalid 'Name' value");
    }
  
    const words = input.split(/[\s\-():/]+/);  // splits on common separators but preserves digits
    let result = "";
  
    for (const word of words) { //re-build the string until word limit is reached
      if (!word) continue;

      const next = result ? `${result} ${word}` : word;
      if (next.length > maxLength) break;

      result = next;
    }
  
    return result || "View Plan"; //fall-back in case no valid result could be created
  }
  