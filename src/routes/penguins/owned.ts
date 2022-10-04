import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { Address } from "@elrondnetwork/erdjs/out";
import { APCNetworkProvider } from "../../classes/APCNetworkProvider";
import { sendSuccessfulJSON } from "../../utils/response";
import { Nonce } from "@elrondnetwork/erdjs-network-providers/out/primitives";

export default async function getPenguins(req: Request, res: Response, proxyNetwork: APCNetworkProvider) {

    const address = new Address(req.params.bech32);

    const accountsNfts = await proxyNetwork.getNftsOfAccount(address);

    const penguinsPromises = accountsNfts
        .filter(nft => nft.collection === penguinsCollection)
        .map((nft) => proxyNetwork.getPenguinFromNft(nft));

    const penguinsNfts = (await Promise.all(penguinsPromises))
        .sort((a, b) => a.nonce - b.nonce);

    sendSuccessfulJSON(res, penguinsNfts);
}