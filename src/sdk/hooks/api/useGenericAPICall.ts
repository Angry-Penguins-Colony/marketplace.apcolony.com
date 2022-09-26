import React from 'react';
import doGetGeneric from 'sdk/api/doGetGeneric';


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

export default useGenericAPICall;