import axios from 'axios';
import { apcLogger, marketplaceApi } from 'config';

function doGetGeneric(urlSuffix: string) {
    if (urlSuffix.startsWith('\\') || urlSuffix.startsWith('/')) {
        urlSuffix = urlSuffix.substring(1);
    }

    const url = marketplaceApi + urlSuffix;

    apcLogger.apiCall(url);

    return axios.get(url);
}

export default doGetGeneric;