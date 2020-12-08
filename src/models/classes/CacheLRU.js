import Cache from "./Cache";
const messageBook = require("../../config/message").messageBook;
const {debugDiagnostics,debugLog} = require("../../config/debug").debugOptions;

class CacheLRU extends Cache {
    constructor() {
        super();
        this.qmr = null; // most recent block (queue head)
        this.qlr = null; // least recent block (queue tail)
    }

    diagnostics() {
        console.log(this.nItems+" "+this.items.size);
        let ptr = this.qmr;
        while (ptr!==null) {
            console.log(ptr.itemValue+" "+ptr.mr+" "+ptr.lr);
            ptr = ptr.lr;
        }
        for (ptr of this.items) {
            console.log(ptr);
        }
    }

    qPush(itemBlock) {
        if (this.nItems===0) {
            this.qmr = itemBlock;
            this.qlr = itemBlock;
        } else {
            this.qmr.mr = itemBlock;
            itemBlock.lr = this.qmr;
            this.qmr = itemBlock;
        }
        this.nItems++;
    }

    qPop() {
        if (this.nItems!==0) {
            if (this.nItems===1) {
                this.qmr = null;
                this.qlr = null;
            } else {
                this.qlr.mr.lr = null;
                this.qlr = this.qlr.mr;
            }
            this.nItems--;
        }
    }

    qMend(itemBlock) {
        if (itemBlock.mr) {
            itemBlock.mr.lr = itemBlock.lr;
        } else {
            this.qmr = itemBlock.lr;
        }
        if (itemBlock.lr) {
            itemBlock.lr.mr = itemBlock.mr;
        } else {
            this.qlr = itemBlock.mr;
        }
        this.nItems--;
        itemBlock.mr = null;
        itemBlock.lr = null;
    }

    put(itemKey,itemValue) {
        if (debugLog) console.log("put - "+itemKey+" - "+itemValue);
        let itemBlock;
        let returnMessage;
        if (this.items.has(itemKey)) {
            itemBlock = this.items.get(itemKey);
            itemBlock.itemValue = itemValue;
            this.qMend(itemBlock);
            returnMessage = "updated '"+itemKey+"':'"+itemValue+"'";
        } else {
            if (this.nItems===this.maxSize) {
                this.items.delete(this.qlr.itemKey);
                this.qPop();
            }
            itemBlock = {
                itemKey:itemKey,
                itemValue:itemValue,
                mr:null, // points to more recent block
                lr:null, // points to less recent block
            };
            this.items.set(itemKey,itemBlock);
            returnMessage = "added '"+itemKey+"':'"+itemValue+"'";
        }
        this.qPush(itemBlock);
        if (debugDiagnostics) this.diagnostics();
        return returnMessage;
    }

    delete(itemKey) {
        if (debugLog) console.log("delete - "+itemKey);
        if (this.items.has(itemKey)) {
            let itemBlock = this.items.get(itemKey);
            this.qMend(itemBlock);
            this.items.delete(itemKey);
        } else {
            throw messageBook.errorMessage.NOT_FOUND;
        }
        if (debugDiagnostics) this.diagnostics();
        return ("deleted '"+itemKey+"'");
    }

    get(itemKey) {
        if (debugLog) console.log("get - "+itemKey);
        if (this.items.has(itemKey)) {
            let itemBlock = this.items.get(itemKey);
            return itemBlock.itemValue;
        } else {
            throw messageBook.errorMessage.NOT_FOUND;
        }
    }
}

export default CacheLRU;