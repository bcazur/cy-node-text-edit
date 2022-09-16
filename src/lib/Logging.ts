var LOG_OPTIONS = {
    enabled: true
}

function log(msg: string, ...parameters: any) {
    if (LOG_OPTIONS.enabled) {
        console.log(`[cytoscape-node-text-edit] ${msg}`, parameters);
    }
}
export { log, LOG_OPTIONS };