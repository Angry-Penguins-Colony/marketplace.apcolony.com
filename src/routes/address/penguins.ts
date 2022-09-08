import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { Address } from "@elrondnetwork/erdjs/out";
import { ProxyNetworkProviderExtended } from "../../classes/ProxyNetworkProviderExtended";
import { sendSuccessfulJSON } from "../../utils/response";
import ConverterWithNetwork from "../../classes/ConverterWithNetwork";

export default async function getPenguins(req: Request, res: Response, proxyNetwork: ProxyNetworkProviderExtended, networkConvert: ConverterWithNetwork) {

    const address = new Address(req.params.bech32);

    const accountsNfts = await proxyNetwork.getNftsOfAccount(address);

    const penguinsPromises = accountsNfts
        .filter(nft => nft.collection === penguinsCollection)
        .map((nft) => networkConvert.getPenguinFromNft(nft));

    const penguinsNfts = (await Promise.all(penguinsPromises))
        .sort((a, b) => a.nonce - b.nonce);

    console.log("Found", penguinsNfts.length, "nfts.");
    penguinsNfts.forEach(({ identifier }) => console.log(identifier))

    sendSuccessfulJSON(res, penguinsNfts);
}