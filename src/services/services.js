const messageBook   = require("../config/message").messageBook;
const cacheService  = require("./cache").cacheService;

// ------------
// App services
// ------------

exports.ping = {
    ping:   async () => "Caching service active...",
};

exports.cache = {
    put:    async (itemKey,itemValue)   => cacheService.put(itemKey,itemValue),
    delete: async itemKey               => cacheService.delete(itemKey),
    get:    async itemKey               => cacheService.get(itemKey),
};
