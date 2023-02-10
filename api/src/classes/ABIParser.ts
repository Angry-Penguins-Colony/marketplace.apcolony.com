import { IOffer, IActivity, IMarketData, INewSaleData, IToken } from "@apcolony/marketplace-api";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";
import { Address } from "@elrondnetwork/erdjs/out";
import { BigNumber } from "bignumber.js";
import { itemsDatabase, penguinsCollection } from "../const";
import { APCNetworkProvider } from "./APCNetworkProvider";
/**
 * @params response: MultiValue2<u64, Auction>
 */
export function parseMultiValueIdAuction(response: any): IOffer {

    const id = new BigNumber(response.items[0].value).toNumber();

    return parseOffer(response.items[1], id);
}

export function parseOffer(response: any, id: number): IOffer {
    const auctioned_tokens = response.fieldsByName.get("auctioned_tokens");

    return {
        id: id,
        price: priceToBigNumber(response.fieldsByName.get("min_bid")).toString(),
        collection: auctioned_tokens.value.fieldsByName.get("token_identifier").value.value,
        nonce: toNumber(auctioned_tokens.value.fieldsByName.get("token_nonce")),
        seller: Address.fromHex(response.fieldsByName.get("original_owner").value.value.valueHex).bech32()
    }
}


export function parseActivity(response: any): IActivity {

    const txByteArray = response.fieldsByName.get("transaction_hash").value.backingCollection.items;
    const tx = Buffer.from(txByteArray).toString("hex");

    return {
        txHash: tx,
        price: priceToBigNumber(response.fieldsByName.get("price")).toString(),
        seller: Address.fromHex(response.fieldsByName.get("seller").value.value.valueHex).bech32(),
        buyer: Address.fromHex(response.fieldsByName.get("buyer").value.value.valueHex).bech32(),
        date: response.fieldsByName.get("buy_timestamp").value.value,
    }
}

export function parseMarketData(response: any): IMarketData {

    return {
        averagePrice: priceToBigNumber(response.fieldsByName.get("average_price")).toString(),
        floorPrice: priceToBigNumber(response.fieldsByName.get("min_price")).toString(),
        totalListed: response.fieldsByName.get("total_listed").value.value,
        totalVolume: priceToBigNumber(response.fieldsByName.get("total_volume")).toString(),
    }
}

export async function parseNewSaleData(response: any, getToken: (identifier: string) => Promise<IToken>): Promise<INewSaleData> {

    console.log("parseNewSaleData response", response);

    const auction = response.fieldsByName.get("auction").value;



    const outputToken = auction.fieldsByName.get("output_token_id").value.value + "-" + new Nonce(auction.fieldsByName.get("output_token_nonce").value.value).hex();

    const outputItem = itemsDatabase.getItemFromIdentifier(outputToken);

    if (outputItem == undefined) {
        throw new Error(`Cannot found item ${outputToken}`);
    }

    const inputToken: IToken = await getToken(auction.fieldsByName.get("input_token_id").value.value);
    const priceNoDecimals = (auction.fieldsByName.get("price").value.value);

    return {
        remainingSupply: response.fieldsByName.get("remaining_output_items").value.value,
        startTimestamp: auction.fieldsByName.get("start_timestamp").value.value,
        maxSupply: auction.fieldsByName.get("max_quantity").value.value,
        item: {
            displayName: outputItem?.displayName,
            url: outputItem?.thumbnailUrls.high,
        },

        price: new BigNumber(priceNoDecimals)
            .toString(),
        token: inputToken
    };
}

export async function parseStakedPenguins(response: any, proxyNetwork: APCNetworkProvider) {

    const nonces: Array<number> = response.items
        .map((o: any) => {
            const penguinNonce = o.value.toNumber();
            return penguinNonce;
        });

    const PenguinsInfo: any = [];
    for await (const nonce of nonces) {
        const PenguinInfo = proxyNetwork.getPenguinFromNft(await proxyNetwork.getNft(penguinsCollection, nonce), true);
        PenguinsInfo.push(PenguinInfo);
    }

    return PenguinsInfo;
}

function priceToBigNumber(response: any): BigNumber {
    return new BigNumber(response.value.value).div("1e18");
}

function toNumber(response: any): number {
    return new BigNumber(response.value.value).toNumber();
}