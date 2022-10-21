import React from 'react'
import Popup from '../Generic/Popup';
import style from './StakePopup.module.scss'

const StakePopup = (
    {
        isVisible,
        closeModal
    }:{
        isVisible: boolean,
        closeModal: () => void
    }
) => {
    return <Popup haveCloseButton={true} isVisible={isVisible} onCloseClicked={closeModal}  >

        <p className={style.title}>Stake</p>

        <table className="table">
            <tbody>
                Test
            </tbody>
        </table>
    </Popup>
}

export default StakePopup;