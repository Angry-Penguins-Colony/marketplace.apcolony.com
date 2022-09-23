import React from 'react';
import { ReactComponent as TopIcon } from 'assets/img/icons/rounded-question-mark.svg'
import Button from 'components/Abstract/Button/Button';
import Popup from 'components/Foreground/Popup/Generic/Popup';

const ModalAboutRender = (props: {
    onSignRenderClick: () => void;
    isVisible?: boolean;
}) => {
    return <Popup
        isVisible={props.isVisible}
        topIcon={<TopIcon />}
    >

        <h2>About customization</h2>
        <p>
            There is <b>two transactions</b> to sign:<br />
            <br />
            The first will render and synchronize the new image with the smart contract.<br />
            You will have to <b>wait the rendering</b> to be done <b>before signing the second transaction.</b><br />
            <br />
            The second transaction will send the NFT to the smart contract with the new image.<br />
        </p>

        <Button type='primary' onClick={props.onSignRenderClick}>Sign render transaction</Button>
    </Popup>
};

export default ModalAboutRender;