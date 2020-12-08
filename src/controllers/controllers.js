const ping =        require("../services/services").ping;
const cache =       require("../services/services").cache;
const wrap =        require("./finalize").wrap;

exports.ping = {
    ping:                       (req,res) => wrap(res,ping.ping()),
};

exports.cache = {
    put:                        (req,res) => wrap(res,cache.put   (req.params.itemKey,req.body.itemValue)),
    delete:                     (req,res) => wrap(res,cache.delete(req.params.itemKey)),
    get:                        (req,res) => wrap(res,cache.get   (req.params.itemKey)),
};
