import { useEffect } from 'react';

/**
 * Add classname to the body and remove them when cleaning up the component
 * @param classnames 
 */
export default function useAddBodyClassNames(classnames: string[]) {
    useEffect(() => {

        for (const className of classnames) {
            document.body.classList.add(className);
        }

        return function cleanup() {
            for (const className of classnames) {
                document.body.classList.remove(className);
            }
        }
    }, []);
}