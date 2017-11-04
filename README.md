# NodeJS RPC Client for Monero Daemon

Monerod-js is a NodeJS RPC Client for Monero Daemon. 

It is written in Typescript and transpiled to Javascript. Using Typescript for development comes with the benefit that all the return values are typed and errors may be spotted earlier.

The official Monero Daemon RPC documentation can be found [here](https://getmonero.org/knowledge-base/developer-guides/daemon-rpc).

Developed for / Last tested with Monerod v0.10.3.1. 

Checkout the [CHANGELOG](CHANGELOG.md) to keep track of the latest changes.

## Install
```
npm install cryptoshrimpi/monerod-js
```

## Test
You need to install the dev dependencies to run the test suite:

```
cd node_modules/monerod-js
npm install
npm test
```

The test's default daemon is `monero.whattheserver.me:8081`. In order to use your local node please edit `test.spec.ts` or `test.spec.js`. Some tests may fail if your daemon is configured to restrict access to certain RPC calls.

## Usage

### Example (Typescript)

```typescript
import { MoneroDaemon } from "node_modules/monerod-js/lib/ts/monerod-js";

var monerod = new MoneroDaemon("monero.whattheserver.me", 8081);

monerod.getBlockCount().then((result) => {
    console.log("Block count: " + result.count);
}).catch((f) => {
    console.log("Something went wrong: " + f);
});
```

### Example (Javascript)

```javascript
const m = require("./node_modules/monerod-js/lib/js/monerod-js");

var monerod = new m.MoneroDaemon("monero.whattheserver.me", 8081);

monerod.getBlockCount().then((result) => {
    console.log("Block count: " + result.count);
}).catch((f) => {
    console.log("Something went wrong: " + f);
});
```

Run the example code: 
```
cd node_modules/monerod-js
node example.js
```

### Available methods
Please see [monerod-js.ts](lib/ts/monerod-js.ts) for a list of the specific return values of each method.


```
getBlockCount()

onGetBlockHash(blockHeight: number)

getBlockTemplate(walletAddress: string, reserveSize: number)

getLastBlockHeader()

getBlockHeaderByHash(hash: string)

getBlockHeaderByHeight(height: number)

getBlock(height: number, hash: string)

getConnections()

getInfo()

getHardFork()

setBans(bans: BansList)

getBans()

getHeight()

getTransactions(txsHashes: string[], decodeAsJson: boolean)

sendRawTransaction(txAsHex: string)

getTransactionPool()

submitBlock(blockBlobData: string)

getVersion()

getFeeEstimate()
```

## Beer
It is highly appreciated if you want to tip me with a beer.

Monero: ```4ATwquCmjnUTuDcF2Yce4YMLexuyFMKF96W7gEA6QU8S5pffgFDi9i29R8yyvHq1MzBVNVXZXUuEtdqpgVRC2hTc7Vtuahu```

## License
MIT. See [LICENSE.md](LICENSE.md).