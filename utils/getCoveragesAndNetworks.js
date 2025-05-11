export function getCoveragesAndNetworks(rawCodes, rawNetworks) {
    //get country codes
    const validCodes = rawCodes
        .split(",")
        .map(code => code.trim())
        .filter(code => code.length == 2);

    if (validCodes.length === 0) throw new Error("No valid country codes found");

    //get networks
    // Parse operators into a Map: code -> [ { name, types } ]
    const OperatorsMap = new Map();
    const coverageEntries = rawNetworks
        .split(";")
        .map(entry => entry.trim())
        .filter(Boolean);
    
    for (const segment of coverageEntries) {
        //separate code from network entries
        const match = segment.trim().match(/^([^-\s]+)\s*-\s*(.+)$/);
        if (!match) {
            console.warn(`Skipping malformed operator segment: "${segment}"`);
            continue;
        }

        const [, codeRaw, networksRaw] = match;
        const code = codeRaw.trim().toUpperCase();//important! so that it'll match extracted code
        if (!code || !networksRaw) continue; //add a warn?////////////

        //split multiple networks
        const networks = networksRaw
            .split(",")
            .map(network => network.trim())
            .filter(Boolean)
            //separate network name and type
            .map(entry => {
                const match = entry.match(/^(.+?)\s+(\dG)$/i);
                if (match) {
                    const [, name, type] = match;
                    return { name: name.trim(), types: [type.toUpperCase()] };//currently not supporting multiple types//////
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