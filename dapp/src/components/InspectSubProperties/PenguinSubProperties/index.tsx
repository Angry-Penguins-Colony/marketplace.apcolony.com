import React from 'react';
import { IOffer, IPenguin } from '@apcolony/marketplace-api';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import AddressWrapper from 'components/AddressWrapper';
import { marketplaceContractAddress, stakeTokenName } from 'config';
import SubProperties from '../SubProperties';

interface Props {
    penguin: IPenguin;
    offer: IOffer | null | undefined;
}

const PenguinSubProperties = ({ penguin, offer }: Props) => {

    const { address: connectedAddress } = useGetAccountInfo();
    const properties = [];

    if (penguin.owner) {
        if (penguin.owner == marketplaceContractAddress.bech32()) {


            const address = offer ? <AddressWrapper bech32={offer.seller} /> : '--';

            properties.push(<>
                For sale by {address}
            </>
            );
        }
        else {
            properties.push(<>
                Owned by {
                    penguin.owner == connectedAddress ?
                        'me' :
                        <AddressWrapper bech32={penguin.owner} />
                }
            </>);
        }
    }

    properties.push(`${calcualteIceSum(penguin)} ${stakeTokenName}`);

    return <SubProperties
        properties={properties}
    />
};

export default PenguinSubProperties;

function calcualteIceSum(penguin: IPenguin) {
    let iceSum = 5;

    for (const slot in penguin.equippedItems) {
        const item = penguin.equippedItems[slot];
        iceSum += item.stakePoints;
    }

    return iceSum;
}