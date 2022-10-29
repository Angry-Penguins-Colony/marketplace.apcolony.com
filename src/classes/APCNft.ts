import { NonFungibleTokenOfAccountOnNetwork } from "@elrondnetwork/erdjs-network-providers/out";

/**
 * The NonFungibleTokenOfAccountOnNetwork class is not implemented properly by erdjs.
 */
export default class APCNft extends NonFungibleTokenOfAccountOnNetwork {
    public owner?: string | undefined;

    public static fromApiHttpResponse(payload: any): APCNft {
        let token = NonFungibleTokenOfAccountOnNetwork.fromApiHttpResponse(payload) as APCNft;

        token.owner = payload.owner;

        if (payload.uris) {
            token.assets = urisFromHttpResponse(payload.uris);
        }

        return token;
    }

    public static fromProxyHttpResponse(payload: any): APCNft {

        let token = NonFungibleTokenOfAccountOnNetwork.fromProxyHttpResponse(payload) as APCNft;
        token.assets = urisFromHttpResponse(payload.uris);
        token.owner = payload.owner;

        return token;
    }
}


function urisFromHttpResponse(uris: any): string[] {
    return (Object.values(uris) as string[])
        .map((uri: string) => Buffer.from(uri, "base64").toString());
}