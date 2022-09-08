import { IAddress } from "@apcolony/marketplace-api";
import { NonFungibleTokenOfAccountOnNetwork, ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out";

/**
 * We create this function because a lot of methods of ProxyNetworkProvider are not implemented yet.
 */
export class ProxyNetworkProviderExtended extends ProxyNetworkProvider {

    private readonly _gatewayUrl: string;

    constructor(url: string) {
        super(url, {
            timeout: 15_000
        });
        this._gatewayUrl = url;
    }

    public async getNftsOfAccount(address: IAddress): Promise<NonFungibleTokenOfAccountOnNetwork[]> {

        const response = await this.doGetGeneric(`address/${address.bech32()}/esdt`);

        const tokens = Object.values(response.esdts)
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