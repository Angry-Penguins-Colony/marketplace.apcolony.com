
export default class Explorer {
    private readonly url: string

    constructor(url: string) {
        if (url.endsWith('/') == false) {
            url += '/';
        }

        this.url = url;
    }

    public getAddress(bech32: string) {
        return this.url + 'accounts/' + bech32;
    }

    public getTransaction(hash: string) {
        return this.url + 'transactions/' + hash;
    }
}