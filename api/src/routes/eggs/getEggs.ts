import { EggsDatabase } from '@apcolony/db-marketplace/out/EggsDatabase';
import { EggTier } from '@apcolony/marketplace-api';
import { Address } from '@multiversx/sdk-core/out';
import { Request, Response } from 'express';
import { APCNetworkProvider } from '../../classes/APCNetworkProvider';
import { sendSuccessfulJSON, withTryCatch } from '../../utils/response';

export default async function getEgg(
    req: Request,
    res: Response,
    eggsDatabase: EggsDatabase,
    networkProvider: APCNetworkProvider
) {

    withTryCatch(res, async () => {

        const tier = req.params.id;
        const owner = req.query.owner;

        if (eggsDatabase.isTierValid(tier)) {
            const egg = eggsDatabase.getEggFromTier(tier as EggTier);

            if (owner && typeof owner == "string") {
                const supply = await networkProvider.getSupply(Address.fromBech32(owner), egg.identifier);

                sendSuccessfulJSON(res, {
                    ownedAmount: supply,
                    ...egg
                })
            }
            else {
                sendSuccessfulJSON(res, egg);
            }
        }
        else {
            res.status(400).send("Invalid id");
        }
    });
}
