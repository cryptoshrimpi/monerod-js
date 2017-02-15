"use strict";
var http = require('http');
class MoneroDaemon {
    constructor(hostname = '127.0.0.1', port = 18081) {
        this.hostname = hostname;
        this.port = port;
    }
    request(requestBody, path = "/json_rpc") {
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
                    if (requestBody.method == "getblock") {
                        body.result.json = JSON.parse(body.result.json);
                    }
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
    buildRequestBody(method, params) {
        return {
            jsonrpc: '2.0',
            id: '0',
            method: method,
            params: params
        };
    }
    getBlockCount() {
        let body = this.buildRequestBody("getblockcount", null);
        return this.request(body);
    }
    onGetBlockHash(blockHeight) {
        let body = this.buildRequestBody("on_getblockhash", [blockHeight]);
        return this.request(body);
    }
    getBlockTemplate(walletAddress, reserveSize) {
        let body = this.buildRequestBody("getblocktemplate", {
            "wallet_address": walletAddress,
            "reserve_size": reserveSize
        });
        return this.request(body);
    }
    getLastBlockHeader() {
        let body = this.buildRequestBody("getlastblockheader", null);
        return this.request(body);
    }
    getBlockHeaderByHash(hash) {
        let body = this.buildRequestBody("getblockheaderbyhash", {
            "hash": hash
        });
        return this.request(body);
    }
    getBlockHeaderByHeight(height) {
        let body = this.buildRequestBody("getblockheaderbyheight", {
            "height": height
        });
        return this.request(body);
    }
    getBlock(height, hash) {
        let body = this.buildRequestBody("getblock", {
            "height": height,
            "hash": hash
        });
        return this.request(body);
    }
    getConnections() {
        let body = this.buildRequestBody("get_connections", null);
        return this.request(body);
    }
    getInfo() {
        let body = this.buildRequestBody("get_info", null);
        return this.request(body);
    }
    getHardFork() {
        let body = this.buildRequestBody("hard_fork_info", null);
        return this.request(body);
    }
    setBans(bans) {
        let body = this.buildRequestBody("setbans", { "bans": bans });
        return this.request(body);
    }
    getBans() {
        let body = this.buildRequestBody("getbans", null);
        return this.request(body);
    }
    getHeight() {
        let body = this.buildRequestBody("getheight", null);
        return this.request(body, "/getheight");
    }
}
exports.MoneroDaemon = MoneroDaemon;
//# sourceMappingURL=monerod-js.js.map