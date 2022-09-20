import { useEffect, useRef } from 'react';

function usePrevious<T>(value: T): T {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref: any = useRef<T>();
    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export default usePrevious;