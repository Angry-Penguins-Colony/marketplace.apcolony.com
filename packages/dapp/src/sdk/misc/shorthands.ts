import { createPortal } from 'react-dom';

export function createModal(element: JSX.Element) {
    const modalId = 'app-modal';
    const modalIdContainer = document.getElementById(modalId);

    if (!modalIdContainer) {
        throw new Error(`Could not find element with id ${modalId} in index.html`);
    }

    return createPortal(element, modalIdContainer);
}