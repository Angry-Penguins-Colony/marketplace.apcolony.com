import { penguinsCollection, placeholdersPenguins } from "../../const";
import { Request, Response } from 'express';
import { getPenguinFromNft, sendSuccessfulJSON } from "../../utils";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";
import { Address } from "@elrondnetwork/erdjs/out";

export default async function getPenguins(req: Request, res: Response, gatewayUrl: string) {

    const address = new Address(req.params.bech32);

    const gatewayProvider = new ProxyNetworkProvider(gatewayUrl);
    const accountsNfts = await gatewayProvider.getNonFungibleTokensOfAccount(address, { from: 0, size: 10000 });

    const penguinsNfts = accountsNfts
        .filter(nft => nft.collection === penguinsCollection)
        .map(getPenguinFromNft);

    console.log("Found", penguinsNfts.length, "nfts.");
    penguinsNfts.forEach(({ identifier }) => console.log(identifier))

    sendSuccessfulJSON(res, penguinsNfts);
}