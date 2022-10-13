import React from 'react';
import { IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core/hooks';
import { Address } from '@elrondnetwork/erdjs/out';
import AddressWrapper from 'components/AddressWrapper';
import { marketplaceContractAddress } from 'config';
import SubProperties from '../SubProperties';

interface Props {
    penguin: IPenguin;
}

const PenguinSubProperties = ({ penguin }: Props) => {

    const { address: connectedAddress } = useGetAccountInfo();
    const properties = [];

    if (penguin.owner) {
        if (penguin.owner == marketplaceContractAddress.bech32()) {
            properties.push('For sale');
        }
        else {
            properties.push(<>
                Owned by {
                    penguin.owner == connectedAddress ?
                        'me' :
                        <AddressWrapper address={Address.fromBech32(penguin.owner)} />
                }
            </>);
        }
    }

    return <SubProperties
        properties={properties}
    />
};

export default PenguinSubProperties;