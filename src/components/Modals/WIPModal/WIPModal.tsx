import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Storage from 'storage/Storage';

const WIPModal = () => {

    const [show, setShow] = React.useState(getShouldOpenModal());


    return <Modal show={show} onHide={close}>
        <Modal.Header>
            <b>
                Work in progress
            </b>
        </Modal.Header>

        <Modal.Body>
            You will access our marketplace under construction.<br />
            Everything can be modified.<br />
            <br />
            To give us your opinion, join our discord :<br />
            <a href="https://discord.com/invite/angry-penguins" target="_blank" rel="noopener noreferrer">
                <Button variant="success" className="w-100 mt-2">Join us</Button>
            </a>
        </Modal.Body>

        <Modal.Footer>
            <Button onClick={close}>
                Ok
            </Button>
        </Modal.Footer>
    </Modal>;

    function close() {
        setShow(false);
        Storage.openWipModal.value = false;
    }

    function getShouldOpenModal(): boolean {
        return process.env.NODE_ENV == 'production' && Storage.openWipModal.value;
    }
};

export default WIPModal;