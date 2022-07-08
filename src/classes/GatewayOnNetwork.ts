import { NetworkConfig, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { INetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/interface";
import { ISigner } from "@elrondnetwork/erdjs-walletcore/out/interface";
import { IAddress, Transaction } from "@elrondnetwork/erdjs/out";
import { sleep } from "ts-apc-utils";
import { TransactionResult } from "../interfaces/TransactionResult";


enum SyncState {
    Not,
    Syncing,
    Synced
}


export default class GatewayOnNetwork {

    private _opt_nonce: number | undefined = undefined;
    private _opt_networkConfig: NetworkConfig | undefined;
    private _opt_syncState: SyncState = SyncState.Not;

    private readonly _senderAddress: IAddress;
    private readonly _networkProvider: INetworkProvider

    private get nonce(): number {
        if (!this._opt_nonce) {
            throw new Error("Nonce is not synced");
        }

        return this._opt_nonce;
    }

    public get networkConfig(): NetworkConfig {
        if (!this._opt_networkConfig) {
            throw new Error("Network config is not synced");
        }

        return this._opt_networkConfig;
    }

    constructor(gatewayUrl: string, senderAddress: IAddress) {
        this._networkProvider = new ProxyNetworkProvider(gatewayUrl, {
            timeout: 60000
        });
        this._senderAddress = senderAddress;
    }

    public incrementNonce(): void {
        this._opt_nonce = this.nonce + 1;
    }

    public async sync() {
        switch (this._opt_syncState) {
            case SyncState.Not:
                this._opt_syncState = SyncState.Syncing;
                {
                    this._opt_networkConfig = await this._networkProvider.getNetworkConfig();

                    let senderOnNetwork = await this._networkProvider.getAccount(this._senderAddress);
                    this._opt_nonce = senderOnNetwork.nonce;
                }
                this._opt_syncState = SyncState.Synced;

                console.log("Gateway synced");

            case SyncState.Syncing:
                // wait for sync to finish
                while (this._opt_syncState != SyncState.Synced) {
                    await sleep(150);
                }
                break;

            case SyncState.Synced:
                // we don't need to do anything
                break;
        }
    }

    public async sendTransaction(tx: Transaction, signer: ISigner): Promise<TransactionResult> {
        await this.sync();

        const nonce = this.nonce;
        tx.setNonce(nonce);
        this.incrementNonce();

        await signer.sign(tx);

        const hash = await this._networkProvider.sendTransaction(tx);

        return { hash, nonce };
    }
}
