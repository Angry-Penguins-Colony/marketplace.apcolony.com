import { IOffer, IActivity } from "@apcolony/marketplace-api";
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
        price: new BigNumber(response.fieldsByName.get("min_bid").value).div(10 ** 18).toString(),
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
        price: new BigNumber(response.fieldsByName.get("price").value).div(10 ** 18).toString(),
        seller: Address.fromHex(response.fieldsByName.get("seller").value.value.valueHex).bech32(),
        buyer: Address.fromHex(response.fieldsByName.get("buyer").value.value.valueHex).bech32(),
        date: response.fieldsByName.get("buy_timestamp").value.value,
    }
}