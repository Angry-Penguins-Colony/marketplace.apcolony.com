import axios from 'axios';
import { apcLogger, marketplaceApi } from 'config';

async function doGetGeneric(urlSuffix: string) {
    const start = Date.now();

    if (urlSuffix.startsWith('\\') || urlSuffix.startsWith('/')) {
        urlSuffix = urlSuffix.substring(1);
    }

    const url = marketplaceApi + urlSuffix;
    const response = await axios.get(url);

    apcLogger.apiCall(url, Date.now() - start);

    return response;
}

export default doGetGeneric;