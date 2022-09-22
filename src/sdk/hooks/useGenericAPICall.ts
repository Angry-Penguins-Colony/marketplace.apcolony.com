import React from 'react';
import axios from 'axios';
import { apcLogger, marketplaceApi } from 'config';


function useGenericAPICall<T>(url: string) {
    const [data, setData] = React.useState<T | undefined>(undefined);

    React.useEffect(() => {
        async function get() {
            const res = await doGetGeneric(url);
            setData(res.data.data);
        }

        get();
    }, []);

    return data;
}

function doGetGeneric(urlSuffix: string) {
    const url = marketplaceApi + urlSuffix;

    apcLogger.apiCall(url);

    return axios.get(url);
}

export default useGenericAPICall;