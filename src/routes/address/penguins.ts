import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { getPenguinFromNft, sendSuccessfulJSON } from "../../utils";
import { Address } from "@elrondnetwork/erdjs/out";
import { ProxyNetwork } from "../../classes/ProxyNetwork";

export default async function getPenguins(req: Request, res: Response, gatewayUrl: string) {

    const address = new Address(req.params.bech32);

    const gatewayProvider = new ProxyNetwork(gatewayUrl);

    const accountsNfts = await gatewayProvider.getNftsOfAccount(address);

    const penguinsNfts = accountsNfts
        .filter(nft => nft.collection === penguinsCollection)
        .map(getPenguinFromNft)
        .sort((a, b) => a.nonce - b.nonce);

    console.log("Found", penguinsNfts.length, "nfts.");
    penguinsNfts.forEach(({ identifier }) => console.log(identifier))

    sendSuccessfulJSON(res, penguinsNfts);
}