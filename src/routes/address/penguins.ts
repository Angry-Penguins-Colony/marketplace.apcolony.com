import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { Address } from "@elrondnetwork/erdjs/out";
import { APCProxyNetworkProvider } from "../../classes/APCProxyNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";

export default async function getPenguins(req: Request, res: Response, proxyNetwork: APCProxyNetworkProvider) {

    const address = new Address(req.params.bech32);

    const accountsNfts = await proxyNetwork.getNftsOfAccount(address);

    const penguinsPromises = accountsNfts
        .filter(nft => nft.collection === penguinsCollection)
        .map((nft) => proxyNetwork.getPenguinFromNft(nft));

    const penguinsNfts = (await Promise.all(penguinsPromises))
        .sort((a, b) => a.nonce - b.nonce);

    console.log("Found", penguinsNfts.length, "nfts.");
    penguinsNfts.forEach(({ identifier }) => console.log(identifier))

    sendSuccessfulJSON(res, penguinsNfts);
}