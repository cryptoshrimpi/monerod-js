"use strict";
const monerod_js_1 = require("../monerod-js");
describe("Testing RPC call: ", function () {
    var monero = new monerod_js_1.MoneroDaemon("monero.whattheserver.me", 8081);
    it("getHardFork", function (done) {
        monero.getHardFork().then((test) => {
            expect(test.status).toBeDefined();
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlock", function (done) {
        monero.getBlock(1, null).then((test) => {
            expect(test.json).toBeDefined();
            expect(test.json.timestamp).toBe(1397818193);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockCount", function (done) {
        monero.getBlockCount().then((test) => {
            expect(test.count).toBeGreaterThan(1);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("onGetBlockHash", function (done) {
        monero.onGetBlockHash(1).then((test) => {
            expect(test).toBe("771fbcd656ec1464d3a02ead5e18644030007a0fc664c0a964d30922821a8148");
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockTemplate", function (done) {
        monero.getBlockTemplate("44GBHzv6ZyQdJkjqZje6KLZ3xSyN1hBSFAnLP6EAqJtCRVzMzZmeXTC2AHKDS9aEDTRKmo6a6o9r9j86pYfhCWDkKjbtcns", 3).then((test) => {
            expect(test.reserved_offset).toBe(130);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getLastBlockHeader", function (done) {
        monero.getLastBlockHeader().then((test) => {
            expect(test.block_header.timestamp).toBeGreaterThan(1486583838);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockHeaderByHash", function (done) {
        monero.getBlockHeaderByHash("e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6").then((test) => {
            expect(test.block_header.timestamp).toBe(1452793716);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockHeaderByHeight", function (done) {
        monero.getBlockHeaderByHeight(1).then((test) => {
            expect(test.block_header.timestamp).toBe(1397818193);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getConnections", function (done) {
        monero.getConnections().then((test) => {
            expect(test.connections.length).toBeGreaterThan(0);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getInfo - Incoming connections", function (done) {
        monero.getInfo().then((test) => {
            expect(test.incoming_connections_count).toBeGreaterThan(0);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("setBan", function (done) {
        monero.setBans([{ ip: "0.0.0.0", ban: true, seconds: 10 }]).then((test) => {
            expect(test.status).toBeDefined();
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBan", function (done) {
        monero.getBans().then((test) => {
            expect(test.bans.length).toBeDefined();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getHeight", function (done) {
        monero.getHeight().then((test) => {
            expect(test.height).toBeGreaterThan(0);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getTransactions('d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408', false)", function (done) {
        monero.getTransactions(["d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408"], false).then((test) => {
            expect(test.status).toEqual("OK");
            expect(test.txs_as_hex).toBeDefined();
            expect(test.txs_as_json).toBeUndefined();
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getTransactions('d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408', true)", function (done) {
        monero.getTransactions(["d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408"], true).then((test) => {
            expect(test.status).toEqual("OK");
            expect(test.txs_as_hex).toBeDefined();
            expect(test.txs_as_json).toBeDefined();
            expect(test.txs_as_json.vin[0].key.amount).toEqual(9999999999);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
});
//# sourceMappingURL=test.spec.js.map