export function getCoveragesAndNetworks(rawCodes, rawNetworks) {
    const networks = rawNetworks

    //get country codes
    const validCodes = rawCodes
        .split(",")
        .map(code => code.trim())
        .filter(code => code.length == 2);

    if (validCodes.length === 0) throw new Error("No valid country codes found");

    // Parse operators into a Map: code → [ { name, types } ]
    const OperatorsMap = new Map();
    const coverageEntries = rawNetworks
        .split(";")
        .map(entry => entry.trim())
        .filter(Boolean);
    
    for (const segment of coverageEntries) {
        const match = segment.trim().match(/^([^-\s]+)\s*-\s*(.+)$/);
        if (!match) {
            console.warn(`Skipping malformed operator segment: "${segment}"`);
            continue;
        }

        const [, codeRaw, networksRaw] = match;
        const code = codeRaw.trim().toUpperCase();
        if (!code || !networksRaw) continue;

        const networks = networksRaw
            .split(",")
            .map(n => n.trim())
            .filter(Boolean)
            .map(entry => {
                const match = entry.match(/^(.+?)\s+(\dG)$/i);
                if (match) {
                    const [, name, type] = match;
                    return { name: name.trim(), types: [type.toUpperCase()] };
                } else {
                    return { name: entry, type:[] };
                }
            });

            if (networks.length > 0) {
                OperatorsMap.set(code, networks);
            }
        }

    //assemble output
    return validCodes.map(code => {
        const networks = OperatorsMap.get(code);
        return networks ? { code, networks } : { code };
    });

}