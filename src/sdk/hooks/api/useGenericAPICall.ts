import React from 'react';
import doGetGeneric from 'sdk/api/doGetGeneric';


function useGenericAPICall<T>(url: string) {
    const [data, setData] = React.useState<T | undefined>(undefined);

    React.useEffect(() => {

        get();
    }, []);

    return {
        data,
        forceReload: get
    };

    async function get() {
        const res = await doGetGeneric(url);
        setData(res.data.data);
    }

}

export default useGenericAPICall;