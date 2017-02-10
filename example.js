const m = require("./lib/js/monerod-js");

var monerod = new m.MoneroDaemon("monero.whattheserver.me", 8081);

monerod.getBlockCount().then((result) => {
    console.log("Block count: " + result.count);
}).catch((f) => {
    console.log("Something went wrong: " + f);
});