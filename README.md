# NodeJS RPC Client for Monero Daemon

Monerod-js is a NodeJS RPC Client for Monero Daemon. 

It is written in Typescript and transpiled to Javascript. I recommend you to use Typescript as I typed all the return values to make life easier.

The official Monero Daemon RPC documentation can be found [here](https://getmonero.org/knowledge-base/developer-guides/daemon-rpc).

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
```

## Beer
Thanks in advance if you wanna tip me with a beer :-)

Monero: ```4AZ75ZMRodTVhGC5KsMzMf4zf1y2Rc4bzYYDiV26XcNt9SKf53J24byXwqGyT6kWhVXxmHfiaXW6iUJiwAXP8yy3A1ChxTj```

## License
MIT. See [LICENSE.md](LICENSE.md).