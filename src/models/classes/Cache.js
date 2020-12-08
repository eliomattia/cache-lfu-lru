const maxSize = require("../../config/cache").cacheOptions.maxSize;
const {debugDiagnostics,debugLog} = require("../../config/debug").debugOptions;

class Cache {
    constructor() {
        this.maxSize = maxSize;
        this.nItems = 0;
        this.items = new Map();
    }

    diagnostics() {}

    put(itemKey,itemValue) {}

    delete(itemKey) {}

    get(itemKey) {}
}

export default Cache;
