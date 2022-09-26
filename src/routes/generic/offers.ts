import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { AbiRegistry, SmartContractAbi, SmartContract, ContractFunction, U64Value, ResultsParser, BytesValue, List } from '@elrondnetwork/erdjs/out';
import { promises } from 'fs';
import { Request, Response } from 'express';
import { gateway, marketplaceContract, penguinsCollection } from '../../const';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON } from '../../utils/response';

export default async function getOffers(req: Request, res: Response, type: "items" | "penguins", networkProvider: APCNetworkProvider) {


    const offers = await networkProvider.getOffers(getCollectionId());

    const response = offers
        .map(o => {
            return {
                ...o,
                ["price"]: o.price.toString(),
            }
        })

    sendSuccessfulJSON(res, response);

    function getCollectionId() {
        switch (type) {
            case "items":
                throw new Error("Not implemented");

            case "penguins":
                return penguinsCollection;
        }
    }
}