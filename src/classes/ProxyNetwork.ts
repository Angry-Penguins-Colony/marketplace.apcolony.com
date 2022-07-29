import { IAddress } from "@apcolony/marketplace-api";
import { NonFungibleTokenOfAccountOnNetwork } from "@elrondnetwork/erdjs-network-providers/out";
import axios from "axios";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class ProxyNetwork {

    private readonly _gatewayUrl: string;

    constructor(gatewayUrl: string) {
        this._gatewayUrl = gatewayUrl;
    }

    public async getNftsOfAccount(address: IAddress): Promise<NonFungibleTokenOfAccountOnNetwork[]> {
        const url = `${this._gatewayUrl}/address/${address}/esdt`;
        const response = await axios.get(url);

        const tokens = Object.values(response.data.data.esdts)
            .filter((item: any) => item.nonce >= 0) // we keep only NFTs        
            .map((item: any) => {
                let token = NonFungibleTokenOfAccountOnNetwork.fromProxyHttpResponse(item);
                token.assets = (Object.values(item.uris) as string[])
                    .map((uri: string) => Buffer.from(uri, "base64").toString());

                return token;
            });

        return tokens;
    }
}