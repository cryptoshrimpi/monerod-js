"use strict";
const monerod_js_1 = require("../monerod-js");
describe("Testing RPC call: ", function () {
    var monerod = new monerod_js_1.MoneroDaemon("monero.whattheserver.me", 8081);
    it("getHardFork", function (done) {
        monerod.getHardFork().then((test) => {
            expect(test.status).toBeDefined();
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlock", function (done) {
        monerod.getBlock(1, null).then((test) => {
            expect(test.json).toBeDefined();
            expect(test.json.timestamp).toBe(1397818193);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockCount", function (done) {
        monerod.getBlockCount().then((test) => {
            expect(test.count).toBeGreaterThan(1);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("onGetBlockHash", function (done) {
        monerod.onGetBlockHash(1).then((test) => {
            expect(test).toBe("771fbcd656ec1464d3a02ead5e18644030007a0fc664c0a964d30922821a8148");
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockTemplate", function (done) {
        monerod.getBlockTemplate("44GBHzv6ZyQdJkjqZje6KLZ3xSyN1hBSFAnLP6EAqJtCRVzMzZmeXTC2AHKDS9aEDTRKmo6a6o9r9j86pYfhCWDkKjbtcns", 3).then((test) => {
            expect(test.reserved_offset).toBe(130);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getLastBlockHeader", function (done) {
        monerod.getLastBlockHeader().then((test) => {
            expect(test.block_header.timestamp).toBeGreaterThan(1486583838);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockHeaderByHash", function (done) {
        monerod.getBlockHeaderByHash("e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6").then((test) => {
            expect(test.block_header.timestamp).toBe(1452793716);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBlockHeaderByHeight", function (done) {
        monerod.getBlockHeaderByHeight(1).then((test) => {
            expect(test.block_header.timestamp).toBe(1397818193);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getConnections", function (done) {
        monerod.getConnections().then((test) => {
            expect(test.connections.length).toBeGreaterThan(0);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getInfo - Incoming connections", function (done) {
        monerod.getInfo().then((test) => {
            expect(test.incoming_connections_count).toBeGreaterThan(0);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("setBan", function (done) {
        monerod.setBans([{ ip: "0.0.0.0", ban: true, seconds: 10 }]).then((test) => {
            expect(test.status).toBeDefined();
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getBan", function (done) {
        monerod.getBans().then((test) => {
            expect(test.bans.length).toBeDefined();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getHeight", function (done) {
        monerod.getHeight().then((test) => {
            expect(test.height).toBeGreaterThan(0);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    // Should return only missing tx
    it("getTransactions should return missing tx, true)", function (done) {
        monerod.getTransactions(['f061d04308f89fd3b18a86f1cb28ab62b1e5aa79364c83ad7ce11a0c7d08fbcb'], true).then(txInfo => {
            expect(txInfo.status).toEqual("OK");
            expect(txInfo.missed_tx[0]).toEqual('f061d04308f89fd3b18a86f1cb28ab62b1e5aa79364c83ad7ce11a0c7d08fbcb');
            expect(txInfo.txs_as_json).toBeUndefined();
            expect(txInfo.txs_as_hex).toBeUndefined();
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getTransactions(['d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408'], false)", function (done) {
        monerod.getTransactions(["d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408"], false).then((test) => {
            expect(test.status).toEqual("OK");
            expect(test.txs_as_hex).toBeDefined();
            expect(test.txs_as_json).toBeUndefined();
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getTransactions(['d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408'], true)", function (done) {
        monerod.getTransactions(["d6e48158472848e6687173a91ae6eebfa3e1d778e65252ee99d7515d63090408"], true).then((test) => {
            expect(test.status).toEqual("OK");
            expect(test.txs_as_hex).toBeDefined();
            expect(test.txs_as_json).toBeDefined();
            // expect(test.txs_as_json.vin[0].key.amount).toEqual(9999999999);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("isKeyImageSpent", function (done) {
        monerod.isKeyImageSpent(["8d1bd8181bf7d857bdb281e0153d84cd55a3fcaa57c3e570f4a49f935850b5e3", "7319134bfc50668251f5b899c66b005805ee255c136f0e1cecbb0f3a912e09d4"]).then((test) => {
            expect(test.status).toEqual("OK");
            expect(test.spent_status).toEqual([monerod_js_1.SpentStatus.spentInBlockchain, monerod_js_1.SpentStatus.spentInBlockchain]);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    /*
  
    /sendrawtransaction is a critical rpc call. therefore this test should be activated by explicitly uncommenting it.
  
    it("sendRawTransaction should fail", function (done) {
      monerod.sendRawTransaction("abc").then((test) => {
        expect(test.status).toEqual("Failed");
        expect(test.double_spend).toEqual(false);
        done();
      }).catch((f) => {
        fail(f);
        done();
      });
    });*/
    it("getTransactionPool", function (done) {
        monerod.getTransactionPool().then((test) => {
            expect(test.status).toEqual("OK");
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("submitBlock", function (done) {
        monerod.submitBlock("notablockblob").then((test) => {
        }).catch((f) => {
            // We expect a specific error msg for this rpc call cause we don't have any blocks to submit
            expect(f).toEqual("Daemon response error. Code: -6, Message: Wrong block blob");
            done();
        });
    });
    it("getVersion", function (done) {
        monerod.getVersion().then((data) => {
            expect(data.version).toBeGreaterThan(10);
            expect(data.status).toEqual("OK");
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
    it("getFeeEstimate", function (done) {
        monerod.getFeeEstimate().then((data) => {
            expect(data.status).toEqual("OK");
            expect(data.fee).toBeGreaterThan(0);
            done();
        }).catch((f) => {
            fail(f);
            done();
        });
    });
});
//# sourceMappingURL=test.spec.js.map