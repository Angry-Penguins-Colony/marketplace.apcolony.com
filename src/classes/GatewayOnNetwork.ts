import { NetworkConfig } from "@elrondnetwork/erdjs-network-providers/out";
import { INetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/interface";
import { sleep } from "ts-apc-utils";


enum SyncState {
    Not,
    Syncing,
    Synced
}


export default class GatewayOnNetwork {

    private _nonce: number | undefined = undefined;
    private _networkConfig: NetworkConfig | undefined;
    private _syncState: SyncState = SyncState.Not;

    public get nonce(): number {
        if (!this._nonce) {
            throw new Error("Nonce is not synced");
        }

        return this._nonce;
    }

    public get networkConfig(): NetworkConfig {
        if (!this._networkConfig) {
            throw new Error("Network config is not synced");
        }

        return this._networkConfig;
    }

    constructor(
        private readonly _networkProvider: INetworkProvider
    ) { }

    public incrementNonce(): void {
        this._nonce = this.nonce + 1;
    }

    public async sync() {
        switch (this._syncState) {
            case SyncState.Not:
                this._syncState = SyncState.Syncing;
                {
                    this._networkConfig = await this._networkProvider.getNetworkConfig();
                }
                this._syncState = SyncState.Synced;

                console.log("Gateway synced");

            case SyncState.Syncing:
                // wait for sync to finish
                while (this._syncState != SyncState.Synced) {
                    await sleep(150);
                }
                break;

            case SyncState.Synced:
                // we don't need to do anything
                break;
        }
    }
}
