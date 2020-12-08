import CacheLRU from "../models/classes/CacheLRU";
import CacheLFU from "../models/classes/CacheLFU";

const evictionStrategy = require("../config/cache").cacheOptions.evictionStrategy;
const activeEvictionStrategy = require("../config/cache").cacheOptions.activeEvictionStrategy;

// Assumption: keys are strings that can be provided within the URI
// Assumption: values are strings to be provided as json to the PUT endpoint
// Assumption: implemented as a Javascript Map for scalability to keys other than strings
// Assumption: there are no concurrency races expected
// Assumption: there are no duplicates, hence a put endpoint is implemented and there is no need to deal with collisions
// Assumption: the cache will be mostly full and rehashing whenever needed will not add excessive overhead
// Assumption: the eviction strategy must be selected as an option before deployment
// -- a dynamic switch between strategies could also be implemented
// Assumption: using Javascript (close to web stack) -- faster implementations can be achieved in lower level languages
// Further development: testing modules (unit/integration)
// Further development: database to sync periodically with the cache (persistence is not the purpose of a cache, but can be useful)

let cache;
if (activeEvictionStrategy===evictionStrategy.LRU) {
    cache = new CacheLRU();
} else /*if (activeEvictionStrategy===evictionStrategy.LFU)*/ {
    cache = new CacheLFU();
}

exports.cacheService = cache;