var http = require('http');

type GetVersionPromise = Promise<{
    status: string,
    version: number
}>

type GetBlockCountPromise = Promise<{
    count: number,
    status: string
}>

type SubmitBlockPromise = Promise<{
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

type GetFeeEstimatePromise = Promise<{
    status: string,
    fee: number
}>;

type GetLastBlockHeaderPromise = Promise<{
    block_header: BlockHeader
}>;

type GetHeightPromise = Promise<{
    height: number;
    status: string;
}>;

type GetBlockHeaderByHashPromise = GetLastBlockHeaderPromise;

type GetBlockHeaderByHeightPromise = GetLastBlockHeaderPromise;

type GetBlockPromise = Promise<{
    blob: string;
    block_header: BlockHeader;
    // json: GetBlockJSON.Root;
    json: any;
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

type GetTransactionsPromise = Promise<{
    status: string,
    txs_as_hex?: string,
    txs_as_json?: any,
    missed_tx?: string[];
}>

export enum SpentStatus {
    unspent = 0,
    spentInBlockchain = 1,
    spentInTransactionPool = 2
}

type SendRawTransactionPromise = Promise<{
    double_spend: boolean;
    fee_too_low: boolean;
    invalid_input: boolean;
    invalid_output: boolean;
    low_mixin: boolean;
    not_rct: boolean;
    not_relayed: boolean;
    overspend: boolean;
    reason: string;
    status: string;
    too_big: boolean;
}>

type IsKeyImageSpentPromise = Promise<{ spent_status: SpentStatus[], status: string }>;

type GetTransactionPoolPromise = Promise<{
    spent_key_images: {
        id_hash: string;
        txs_hashes: string[]
    }[];
    status: string;
    transactions: {
        blob_size: number;
        fee: any;
        id_hash: string;
        kept_by_block: boolean;
        last_failed_height: number;
        last_failed_id_hash: string;
        max_used_block_height: number;
        max_used_block_id_hash: string;
        receive_time: number;
        relayed: boolean;
        // tx_json: GetTransactionPoolTransaction;
        tx_json: string; // monero returns invalid json...
    }[];
}>;


type GetTransactionPoolTransaction = {
    version: number;
    unlock_time: number;
    vin: {
        key: {
            amount: number;
            key_offsets: number[];
            k_image: string;
        }
    }[];
    vout: {
        amount: number;
        target: { key: string; }
    }[];
    extra: number[];
    rct_signatures: {
        type: number;
        txnFee: number;
        ecdhInfo: {
            mask: string;
            amount: string;
        }[];
        outPk: string[];
    };
    rctsig_prunable: {
        rangeSigs: {
            asig: string;
            Ci: string;
        }[];
        MGs: {
            ss: string[][];
            cc: string;
        }[];
    };
}

declare module getTransactionsTxsAsJson {

    type Key = {
        amount: number;
        key_offsets: number[];
        k_image: string;
    }

    type Vin = {
        key: Key;
    }

    type Vout = {
        amount: number;
        target: { key: string };
    }

    export type Root = {
        version: number;
        unlock_time: number;
        vin: Vin[];
        vout: Vout[];
        extra: number[];
        signatures: string[];
    }

}

export class MoneroDaemon {

    private hostname;
    private port;

    constructor(hostname: string = '127.0.0.1', port: number = 18081) {
        this.hostname = hostname;
        this.port = port;
    }

    private defaultRequest(requestBody: RequestBody): Promise<any> {
        return this.request(requestBody, "/json_rpc");
    }

    private request(requestBody: any, path: String): Promise<any> {

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
                    } else if (!isDefaultPath && body) {
                        resolve(body);
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

    private buildDefaultRequestBody(method: string, params: any): RequestBody {
        return {
            jsonrpc: '2.0',
            id: '0',
            method: method,
            params: params
        };
    }

    public getBlockCount(): GetBlockCountPromise {
        let body = this.buildDefaultRequestBody("getblockcount", null);
        return this.defaultRequest(body) as GetBlockCountPromise;
    }

    public onGetBlockHash(blockHeight: number): OnGetBlockHashPromise {
        let body = this.buildDefaultRequestBody("on_getblockhash", [blockHeight]);
        return this.defaultRequest(body) as OnGetBlockHashPromise;
    }

    public getBlockTemplate(walletAddress: string, reserveSize: number): GetBlockTemplatePromise {
        let body = this.buildDefaultRequestBody("getblocktemplate", {
            "wallet_address": walletAddress,
            "reserve_size": reserveSize
        });
        return this.defaultRequest(body) as GetBlockTemplatePromise;
    }

    public getLastBlockHeader(): GetLastBlockHeaderPromise {
        let body = this.buildDefaultRequestBody("getlastblockheader", null);
        return this.defaultRequest(body) as GetLastBlockHeaderPromise;
    }

    public getBlockHeaderByHash(hash: string): GetBlockHeaderByHashPromise {
        let body = this.buildDefaultRequestBody("getblockheaderbyhash", {
            "hash": hash
        });
        return this.defaultRequest(body) as GetBlockHeaderByHashPromise;
    }

    public getBlockHeaderByHeight(height: number): GetBlockHeaderByHeightPromise {
        let body = this.buildDefaultRequestBody("getblockheaderbyheight", {
            "height": height
        });
        return this.defaultRequest(body) as GetBlockHeaderByHeightPromise;
    }

    public getBlock(height: number, hash: string): GetBlockPromise {
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
        }) as GetBlockPromise;
    }

    public getConnections(): GetConnectionsPromise {
        let body = this.buildDefaultRequestBody("get_connections", null);
        return this.defaultRequest(body) as GetConnectionsPromise;
    }

    public getInfo(): GetInfoPromise {
        let body = this.buildDefaultRequestBody("get_info", null);
        return this.defaultRequest(body) as GetInfoPromise;
    }

    public getHardFork(): GetHardForkPromise {
        let body = this.buildDefaultRequestBody("hard_fork_info", null);
        return this.defaultRequest(body) as GetHardForkPromise;
    }

    public setBans(bans: BansList): SetBansPromise {
        let body = this.buildDefaultRequestBody("setbans", { "bans": bans });
        return this.defaultRequest(body) as SetBansPromise;
    }

    public getBans(): GetBansPromise {
        let body = this.buildDefaultRequestBody("getbans", null);
        return this.defaultRequest(body) as GetBansPromise;
    }

    public getHeight(): GetHeightPromise {
        return this.request({}, "/getheight") as GetHeightPromise;
    }

    public getTransactions(txsHashes: string[], decodeAsJson: boolean): GetTransactionsPromise {
        let body = { txs_hashes: txsHashes, decode_as_json: decodeAsJson };

        return new Promise((resolve, reject) => {
            this.request(body, "/gettransactions").then((a: any) => {
                if (decodeAsJson && a.hasOwnProperty("txs_as_json")) {
                    a.txs_as_json = JSON.parse(a.txs_as_json);
                }
                resolve(a);
            }).catch((f) => {
                reject(f);
            });
        }) as GetTransactionsPromise;
    }

    public isKeyImageSpent(keyImages: string[]): IsKeyImageSpentPromise {
        return this.request({ key_images: keyImages }, "/is_key_image_spent") as IsKeyImageSpentPromise;
    }

    public sendRawTransaction(txAsHex: string): SendRawTransactionPromise {
        return this.request({ tx_as_hex: txAsHex }, "/sendrawtransaction") as SendRawTransactionPromise;
    }

    public getTransactionPool(): GetTransactionPoolPromise {
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
        }) as GetTransactionPoolPromise;
    }

    public submitBlock(blockBlobData: string): SubmitBlockPromise {
        let body = this.buildDefaultRequestBody("submitblock", [blockBlobData]);
        return this.defaultRequest(body) as SubmitBlockPromise;
    }

    public getVersion(): GetVersionPromise {
        let body = this.buildDefaultRequestBody("get_version", null);
        return this.defaultRequest(body) as GetVersionPromise;
    }

    public getFeeEstimate(): GetFeeEstimatePromise {
        let body = this.buildDefaultRequestBody("get_fee_estimate", null);
        return this.defaultRequest(body) as GetFeeEstimatePromise;
    }

}