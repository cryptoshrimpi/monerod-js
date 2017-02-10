var http = require('http');

type GetBlockCountPromise = Promise<{
    count: number,
    status: string
}>

type OnGetBlockHashPromise = Promise<string>;

type GetBlockTemplatePromise = Promise<{
    blocktemplate_blob: string,
    difficulty: number,
    height: number,
    prev_hash: string,
    reserved_offset: number,
    status: string
}>;

type BlockHeader = {
    depth: number;
    difficulty: number;
    hash: string;
    height: number;
    major_version: number;
    minor_version: number;
    nonce: number;
    orphan_status: boolean;
    prev_hash: string;
    reward: number;
    timestamp: number;
};

type GetLastBlockHeaderPromise = Promise<{
    block_header: BlockHeader
}>;

type GetBlockHeaderByHashPromise = GetLastBlockHeaderPromise;

type GetBlockHeaderByHeightPromise = GetLastBlockHeaderPromise;

type GetBlockPromise = Promise<{
    blob: string;
    block_header: BlockHeader;
    json: GetBlockJSON.Root;
    status: string;
}>;

module GetBlockJSON {

    type Gen = {
        height: number;
    }

    type Vin = {
        gen: Gen;
    }

    type Target = {
        key: string;
    }

    type Vout = {
        amount: any;
        target: Target;
    }

    type MinerTx = {
        version: number;
        unlock_time: number;
        vin: Vin[];
        vout: Vout[];
        extra: number[];
        signatures: any[];
    }

    export type Root = {
        major_version: number;
        minor_version: number;
        timestamp: number;
        prev_id: string;
        nonce: number;
        miner_tx: MinerTx;
        tx_hashes: any[];
    }

}

type GetConnectionsPromise = Promise<{
    connections: {
        avg_download: number;
        avg_upload: number;
        current_download: number;
        current_upload: number;
        incoming: boolean;
        ip: string;
        live_time: number;
        local_ip: boolean;
        localhost: boolean;
        peer_id: string;
        port: string;
        recv_count: number;
        recv_idle_time: number;
        send_count: number;
        send_idle_time: number;
        state: string;
    }[];
    status: string;
}>;


type GetInfoPromise = Promise<{
    alt_blocks_count: number;
    difficulty: number;
    grey_peerlist_size: number;
    height: number;
    incoming_connections_count: number;
    outgoing_connections_count: number;
    status: string;
    target: number;
    target_height: number;
    testnet: boolean;
    top_block_hash: string;
    tx_count: number;
    tx_pool_size: number;
    white_peerlist_size: number;
}>;


type GetHardForkPromise = Promise<{
    earliest_height: number;
    enabled: boolean;
    state: number;
    status: string;
    threshold: number;
    version: number;
    votes: number;
    voting: number;
    window: number;
}>;

type BansList = { ip: string, ban: Boolean, seconds: number }[];

type SetBansPromise = Promise<{
    status: string;
}>;

type GetBansPromise = Promise<{
    bans: { ip: string, seconds: number }[];
    status: string;
}>;

type RequestBody = { jsonrpc: string, id: string, method: string, params: any };

export class MoneroDaemon {

    private hostname;
    private port;

    constructor(hostname, port) {
        this.hostname = hostname || '127.0.0.1';
        this.port = port || 18081;
    }

    private request(requestBody: RequestBody): Promise<any> {

        let requestJSON = JSON.stringify(requestBody);

        let headers = {};
        headers["Content-Type"] = 'application/json';
        headers["Content-Length"] = Buffer.byteLength(requestJSON, 'utf8');

        let options = {
            hostname: this.hostname,
            port: this.port,
            path: '/json_rpc',
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

                    if (body && body.result) {
                        resolve(body.result);
                    } else if (body && body.error) {
                        reject("Daemon response error. Code: " + body.error.code + ", Message: " + body.error.message);
                    } else {
                        reject("Daemon response error");
                    }
                });
            });
            req.on('error', (e) => reject("Daemon response error: " + e.message));
            req.write(requestJSON);
            req.end();
        });
    }

    private buildRequestBody(method: string, params: any): RequestBody {
        return {
            jsonrpc: '2.0',
            id: '0',
            method: method,
            params: params
        };
    }

    public getBlockCount(): GetBlockCountPromise {
        let body = this.buildRequestBody("getblockcount", null);
        return this.request(body) as GetBlockCountPromise;
    }

    public onGetBlockHash(blockHeight: number): OnGetBlockHashPromise {
        let body = this.buildRequestBody("on_getblockhash", [blockHeight]);
        return this.request(body) as OnGetBlockHashPromise;
    }

    public getBlockTemplate(walletAddress: string, reserveSize: number): GetBlockTemplatePromise {
        let body = this.buildRequestBody("getblocktemplate", {
            "wallet_address": walletAddress,
            "reserve_size": reserveSize
        });
        return this.request(body) as GetBlockTemplatePromise;
    }

    public getLastBlockHeader(): GetLastBlockHeaderPromise {
        let body = this.buildRequestBody("getlastblockheader", null);
        return this.request(body) as GetLastBlockHeaderPromise;
    }

    public getBlockHeaderByHash(hash: string): GetBlockHeaderByHashPromise {
        let body = this.buildRequestBody("getblockheaderbyhash", {
            "hash": hash
        });
        return this.request(body) as GetBlockHeaderByHashPromise;
    }

    public getBlockHeaderByHeight(height: number): GetBlockHeaderByHeightPromise {
        let body = this.buildRequestBody("getblockheaderbyheight", {
            "height": height
        });
        return this.request(body) as GetBlockHeaderByHeightPromise;
    }

    public getBlock(height: number, hash: string): GetBlockPromise {
        let body = this.buildRequestBody("getblock", {
            "height": height,
            "hash": hash
        });
        return this.request(body) as GetBlockPromise;
    }

    public getConnections(): GetConnectionsPromise {
        let body = this.buildRequestBody("get_connections", null);
        return this.request(body) as GetConnectionsPromise;
    }

    public getInfo(): GetInfoPromise {
        let body = this.buildRequestBody("get_info", null);
        return this.request(body) as GetInfoPromise;
    }

    public getHardFork(): GetHardForkPromise {
        let body = this.buildRequestBody("hard_fork_info", null);
        return this.request(body) as GetHardForkPromise;
    }

    public setBans(bans: BansList): SetBansPromise {
        let body = this.buildRequestBody("setbans", { "bans": bans });
        return this.request(body) as SetBansPromise;
    }

    public getBans(): GetBansPromise {
        let body = this.buildRequestBody("getbans", null);
        return this.request(body) as GetBansPromise;
    }

}