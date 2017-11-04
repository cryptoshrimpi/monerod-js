"use strict";
var http = require('http');
var SpentStatus;
(function (SpentStatus) {
    SpentStatus[SpentStatus["unspent"] = 0] = "unspent";
    SpentStatus[SpentStatus["spentInBlockchain"] = 1] = "spentInBlockchain";
    SpentStatus[SpentStatus["spentInTransactionPool"] = 2] = "spentInTransactionPool";
})(SpentStatus = exports.SpentStatus || (exports.SpentStatus = {}));
class MoneroDaemon {
    constructor(hostname = '127.0.0.1', port = 18081) {
        this.hostname = hostname;
        this.port = port;
    }
    defaultRequest(requestBody) {
        return this.request(requestBody, "/json_rpc");
    }
    request(requestBody, path) {
        let requestJSON = JSON.stringify(requestBody);
        let isDefaultPath = (path == "/json_rpc");
        let headers = {};
        headers["Content-Type"] = 'application/json';
        headers["Content-Length"] = Buffer.byteLength(requestJSON, 'utf8');
        let options = {
            hostname: this.hostname,
            port: this.port,
            path: path,
            method: 'POST',
            headers: headers
        };
        return new Promise((resolve, reject) => {
            let data = '';
            let req = http.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', function () {
                    let body = JSON.parse(data);
                    if (isDefaultPath && body && body.result) {
                        resolve(body.result);
                    }
                    else if (!isDefaultPath && body) {
                        resolve(body);
                    }
                    else if (body && body.error) {
                        reject("Daemon response error. Code: " + body.error.code + ", Message: " + body.error.message);
                    }
                    else {
                        reject("Daemon response error");
                    }
                });
            });
            req.on('error', (e) => reject("Daemon response error: " + e.message));
            req.write(requestJSON);
            req.end();
        });
    }
    buildDefaultRequestBody(method, params) {
        return {
            jsonrpc: '2.0',
            id: '0',
            method: method,
            params: params
        };
    }
    getBlockCount() {
        let body = this.buildDefaultRequestBody("getblockcount", null);
        return this.defaultRequest(body);
    }
    onGetBlockHash(blockHeight) {
        let body = this.buildDefaultRequestBody("on_getblockhash", [blockHeight]);
        return this.defaultRequest(body);
    }
    getBlockTemplate(walletAddress, reserveSize) {
        let body = this.buildDefaultRequestBody("getblocktemplate", {
            "wallet_address": walletAddress,
            "reserve_size": reserveSize
        });
        return this.defaultRequest(body);
    }
    getLastBlockHeader() {
        let body = this.buildDefaultRequestBody("getlastblockheader", null);
        return this.defaultRequest(body);
    }
    getBlockHeaderByHash(hash) {
        let body = this.buildDefaultRequestBody("getblockheaderbyhash", {
            "hash": hash
        });
        return this.defaultRequest(body);
    }
    getBlockHeaderByHeight(height) {
        let body = this.buildDefaultRequestBody("getblockheaderbyheight", {
            "height": height
        });
        return this.defaultRequest(body);
    }
    getBlock(height, hash) {
        let body = this.buildDefaultRequestBody("getblock", {
            "height": height,
            "hash": hash
        });
        return new Promise((resolve, reject) => {
            this.defaultRequest(body).then((a) => {
                a.json = JSON.parse(a.json);
                resolve(a);
            }).catch((f) => {
                reject(f);
            });
        });
    }
    getConnections() {
        let body = this.buildDefaultRequestBody("get_connections", null);
        return this.defaultRequest(body);
    }
    getInfo() {
        let body = this.buildDefaultRequestBody("get_info", null);
        return this.defaultRequest(body);
    }
    getHardFork() {
        let body = this.buildDefaultRequestBody("hard_fork_info", null);
        return this.defaultRequest(body);
    }
    setBans(bans) {
        let body = this.buildDefaultRequestBody("setbans", { "bans": bans });
        return this.defaultRequest(body);
    }
    getBans() {
        let body = this.buildDefaultRequestBody("getbans", null);
        return this.defaultRequest(body);
    }
    getHeight() {
        return this.request({}, "/getheight");
    }
    getTransactions(txsHashes, decodeAsJson) {
        let body = { txs_hashes: txsHashes, decode_as_json: decodeAsJson };
        return new Promise((resolve, reject) => {
            this.request(body, "/gettransactions").then((a) => {
                if (decodeAsJson && a.hasOwnProperty("txs_as_json")) {
                    a.txs_as_json = JSON.parse(a.txs_as_json);
                }
                resolve(a);
            }).catch((f) => {
                reject(f);
            });
        });
    }
    isKeyImageSpent(keyImages) {
        return this.request({ key_images: keyImages }, "/is_key_image_spent");
    }
    sendRawTransaction(txAsHex) {
        return this.request({ tx_as_hex: txAsHex }, "/sendrawtransaction");
    }
    getTransactionPool() {
        return new Promise((resolve, reject) => {
            this.request({}, "/get_transaction_pool").then((a) => {
                /*
                Monero returns invalid JSON
                for (var key in a.transactions) {
                    a.transactions[key].tx_json = JSON.parse(a.transactions[key].tx_json);
                }*/
                resolve(a);
            }).catch((f) => {
                reject(f);
            });
        });
    }
    submitBlock(blockBlobData) {
        let body = this.buildDefaultRequestBody("submitblock", [blockBlobData]);
        return this.defaultRequest(body);
    }
    getVersion() {
        let body = this.buildDefaultRequestBody("get_version", null);
        return this.defaultRequest(body);
    }
    getFeeEstimate() {
        let body = this.buildDefaultRequestBody("get_fee_estimate", null);
        return this.defaultRequest(body);
    }
}
exports.MoneroDaemon = MoneroDaemon;
//# sourceMappingURL=monerod-js.js.map