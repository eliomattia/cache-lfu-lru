import Cache from "./Cache";
const messageBook = require("../../config/message").messageBook;
const {debugDiagnostics,debugLog} = require("../../config/debug").debugOptions;

class CacheLFU extends Cache {
    constructor() {
        super();
        this.heap = [];
    }

    diagnostics() {
        console.log(this.nItems+" "+this.items.size);
        let ptr = this.heap;
        for (let j=0;j<this.nItems;j++) console.log(j+" "+ptr[j].itemKey+" "+ptr[j].itemValue+" "+ptr[j].n+" "+ptr[j].i);
        for (ptr of this.items) {
            console.log(ptr);
        }
    }

    hSwap(i,j) {
        let k;
        this.heap[i].i = j;
        this.heap[j].i = i;
        k = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = k;
    }

    hBubble(i) {
        const parent = i => Math.floor((i-1)/2);
        if (i>0) {
            const j = parent(i);
            if (this.heap[i].n<this.heap[j].n) {
                this.hSwap(i,j);
                if (j>0) this.hBubble(j);
            }
        }
    }

    hSink(i) {
        const lchild = i => 2*i+1;
        const rchild = i => 2*i+2;
        const l = (this.heap[lchild(i)])?this.heap[lchild(i)].n:null;
        const r = (this.heap[rchild(i)])?this.heap[rchild(i)].n:null;
        let j = null;
        if (l&&r) {j = (l<r)?lchild(i):rchild(i);} else if (l) {j = lchild(i);} else if (r) {j = rchild(i);}
        if (j) {
            if (this.heap[i].n>this.heap[j].n) {
                this.hSwap(i,j);
                this.hSink(j);
            }
        }
    }

    hPop() {
        // pop the root => put the last element at the root, decrease size, sink if necessary
        this.heap[0] = this.heap[this.nItems-1];
        this.heap[this.nItems-1] = null;
        this.nItems--;
        this.hSink(0);
    }

    hPush(itemBlock) {
        // push new element => increase size, add as the last, bubble if necessary
        this.nItems++;
        let i = this.nItems-1;
        this.heap[i] = itemBlock;
        itemBlock.i = i;
        this.hBubble(i);
    }

    put(itemKey,itemValue) {
        if (debugLog) console.log("put - "+itemKey+" - "+itemValue);
        let itemBlock;
        let returnMessage;
        if (this.items.has(itemKey)) {
            itemBlock = this.items.get(itemKey);
            itemBlock.itemValue = itemValue;
            itemBlock.n++;
            // increase n for an element => sink if necessary
            this.hSink(itemBlock.i);
            returnMessage = "updated '"+itemKey+"':'"+itemValue+"'";
        } else {
            if (this.nItems===this.maxSize) {
                this.items.delete(this.heap[0].itemKey);
                this.hPop();
            }
            itemBlock = {
                itemKey:itemKey,
                itemValue:itemValue,
                n:1,    // #times accessed/updated
                i:null, // heap position for hash access to the heap
            };
            this.items.set(itemKey,itemBlock);
            returnMessage = "added '"+itemKey+"':'"+itemValue+"'";
            this.hPush(itemBlock);
        }
        if (debugDiagnostics) this.diagnostics();
        return returnMessage;
    }

    delete(itemKey) {
        // swap with the last, then delete the new last, then sink or bubble swapped element as necessary
        if (debugLog) console.log("delete - "+itemKey);
        if (this.items.has(itemKey)) {
            let itemBlock = this.items.get(itemKey);
            console.log(itemBlock);
            const odd = itemBlock.i;
            console.log(odd);
            this.hSwap(odd,this.nItems-1);
            this.items.delete(itemKey);
            this.heap[this.nItems-1] = null;
            this.nItems--;
            this.hBubble(odd);
            this.hSink(odd);
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
            itemBlock.n++;
            // increase n for an element => sink if necessary
            this.hSink(itemBlock.i);
            return itemBlock.itemValue;
        } else {
            throw messageBook.errorMessage.NOT_FOUND;
        }
    }
}

export default CacheLFU;