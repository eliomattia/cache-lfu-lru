let cacheOptions = {
    evictionStrategy: {
        LRU: "LRU",
        LFU: "LFU",
    },
    maxSize: null,
    activeEvictionStrategy: null,
};

cacheOptions.maxSize = 5;
cacheOptions.activeEvictionStrategy = cacheOptions.evictionStrategy.LFU;

exports.cacheOptions = cacheOptions;