import { IOffer, IActivity, IMarketData } from "@apcolony/marketplace-api";
import { Address } from "@elrondnetwork/erdjs/out";
import { BigNumber } from "bignumber.js";
/**
 * @params response: MultiValue2<u64, Auction>
 */
export function parseMultiValueIdAuction(response: any): IOffer {

    const id = response.items[0].value;

    return parseOffer(response.items[1], id);
}

export function parseOffer(response: any, id: number) {
    const auctioned_tokens = response.fieldsByName.get("auctioned_tokens");

    return {
        id: id,
        price: fromBigNumberToString(response.fieldsByName.get("min_bid")),
        collection: auctioned_tokens.value.fieldsByName.get("token_identifier").value.value,
        nonce: auctioned_tokens.value.fieldsByName.get("token_nonce").value.value,
        seller: Address.fromHex(response.fieldsByName.get("original_owner").value.value.valueHex).bech32()
    }
}


export function parseActivity(response: any): IActivity {

    const txByteArray = response.fieldsByName.get("transaction_hash").value.backingCollection.items;
    const tx = Buffer.from(txByteArray).toString("hex");

    return {
        txHash: tx,
        price: fromBigNumberToString(response.fieldsByName.get("price")),
        seller: Address.fromHex(response.fieldsByName.get("seller").value.value.valueHex).bech32(),
        buyer: Address.fromHex(response.fieldsByName.get("buyer").value.value.valueHex).bech32(),
        date: response.fieldsByName.get("buy_timestamp").value.value,
    }
}

export function parseMarketData(response: any): IMarketData {

    return {
        averagePrice: fromBigNumberToString(response.fieldsByName.get("average_price")),
        floorPrice: fromBigNumberToString(response.fieldsByName.get("min_price")),
        totalListed: response.fieldsByName.get("total_listed").value.value,
        totalVolume: fromBigNumberToString(response.fieldsByName.get("total_volume")),
    }
}

function fromBigNumberToString(response: any): string {
    const bigNumber = new BigNumber(response.value.value).div("1e18");

    return bigNumber.toString();
}