import React from 'react';
import doGetGeneric from 'sdk/api/doGetGeneric';

export interface IGenericAPIOptions {
    onGetError?: (error: any) => void;
}

function useGenericAPICall<T>(url: string, options?: IGenericAPIOptions) {
    const [data, setData] = React.useState<T | undefined>(undefined);

    React.useEffect(() => {

        get();
    }, []);

    return {
        data,
        forceReload: get
    };

    async function get() {
        try {
            return;
            const res = await doGetGeneric(url)
            setData(res.data.data);
        }
        catch (e) {
            if (options?.onGetError) {
                options.onGetError(e);
            }
        }
    }

}

export default useGenericAPICall;