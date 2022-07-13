import { NetworkConfig, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { INetworkProvider } from "@elrondnetwork/erdjs-network-providers/out/interface";
import { ISigner } from "@elrondnetwork/erdjs-walletcore/out/interface";
import { IAddress, ISmartContract, StringValue, Transaction, TransactionPayload } from "@elrondnetwork/erdjs/out";
import { sleep } from "ts-apc-utils";
import { TransactionResult } from "../interfaces/TransactionResult";
import { CIDKvp } from "../structs/CIDKvp";
import BigNumber from "bignumber.js";
import colors from "colors";

enum SyncState {
    Not,
    Syncing,
    Synced
}


export default class WriteGateway {

    private _opt_nonce: number | undefined = undefined;
    private _opt_networkConfig: NetworkConfig | undefined;
    private _opt_syncState: SyncState = SyncState.Not;

    private readonly _senderAddress: IAddress;
    private readonly _networkProvider: INetworkProvider
    private readonly _signer: ISigner;

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

    public get senderAddress(): IAddress {
        return this._senderAddress;
    }

    constructor(gatewayUrl: string, senderAddress: IAddress, signer: ISigner) {
        this._networkProvider = new ProxyNetworkProvider(gatewayUrl, {
            timeout: 60000
        });
        this._senderAddress = senderAddress;
        this._signer = signer;
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

    public async claimBalance(contract: ISmartContract): Promise<TransactionResult> {
        const tx = contract.call({
            func: { name: "claim" },
            args: [],
            value: "",
            gasLimit: 10_000_000,
            gasPrice: this.networkConfig.MinGasPrice,
            chainID: this.networkConfig.ChainID,
        });

        return this.sendTransaction(tx);
    }

    public async setCid(cid: CIDKvp[], customisationContract: ISmartContract): Promise<TransactionResult> {
        if (cid.length == 0) throw new Error("No CID to send");

        const func = { name: "setCidOf" };
        const args = cid
            .flatMap(({ cid, attributes }) => [
                new StringValue(attributes.toAttributes()),
                new StringValue(cid)
            ]);

        const tx = customisationContract.call({
            func: func,
            args: args,
            value: "",
            gasLimit: cid.length * 30_000_000,
            gasPrice: this.networkConfig.MinGasPrice,
            chainID: this.networkConfig.ChainID,
        });

        const result = await this.sendTransaction(tx);

        console.log(`Sent ${cid.length} CIDs to customisation contract. Transaction hash: ${result.hash.grey}`);

        return result;
    }

    public async sendTransaction(tx: Transaction): Promise<TransactionResult> {
        await this.sync();

        const nonce = this.nonce;
        tx.setNonce(nonce);
        this._opt_nonce = this.nonce + 1;

        await this._signer.sign(tx);

        const hash = await this._networkProvider.sendTransaction(tx);

        return { hash, nonce };
    }
}
