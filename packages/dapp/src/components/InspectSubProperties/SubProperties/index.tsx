import React from 'react';

interface Props {
    properties: (string | JSX.Element)[]
}

const SubProperties = ({ properties }: Props) => {
    return <div>
        {
            properties.map((property, index) => {
                return <p key={index}>
                    {property}
                </p>
            })
        }

    </div>;
}

export default SubProperties;
