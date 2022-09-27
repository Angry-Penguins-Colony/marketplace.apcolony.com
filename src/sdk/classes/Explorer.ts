import { IAddress } from '@elrondnetwork/erdjs/out';

export default class Explorer {
    private readonly url: string

    constructor(url: string) {
        if (url.endsWith('/') == false) {
            url += '/';
        }

        this.url = url;
    }

    public getAddress(address: IAddress) {
        return this.url + 'accounts/' + address.bech32();
    }
}