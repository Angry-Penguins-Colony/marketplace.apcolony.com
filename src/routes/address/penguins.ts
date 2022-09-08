import { penguinsCollection } from "../../const";
import { Request, Response } from 'express';
import { Address } from "@elrondnetwork/erdjs/out";
import { ProxyNetwork } from "../../classes/ProxyNetwork";
import { sendSuccessfulJSON } from "../../utils/response";
import ConverterWithNetwork from "../../classes/ConverterWithNetwork";

export default async function getPenguins(req: Request, res: Response, proxyNetwork: ProxyNetwork, networkConvert: ConverterWithNetwork) {

    const address = new Address(req.params.bech32);

    const accountsNfts = await proxyNetwork.getNftsOfAccount(address);

    const penguinsNfts = accountsNfts
        .filter(nft => nft.collection === penguinsCollection)
        .map(networkConvert.getPenguinFromNft)
        .sort((a, b) => a.nonce - b.nonce);

    console.log("Found", penguinsNfts.length, "nfts.");
    penguinsNfts.forEach(({ identifier }) => console.log(identifier))

    sendSuccessfulJSON(res, penguinsNfts);
}