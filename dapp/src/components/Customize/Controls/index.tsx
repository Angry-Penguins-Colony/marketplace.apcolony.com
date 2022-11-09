import React from 'react';
import Button from 'components/Abstract/Button/Button';
import { routeNames } from 'routes';
import style from './index.module.scss';

interface IProps {
    doUserOwnSelectedPenguin?: boolean;
    renderStatus?: string;
    hasSomeModifications: boolean;
    onRenderClick: () => void;
    onCustomizeClick: () => void;
}

type Step = 'modify' | 'render' | 'customize';

const CustomizeControls = ({
    doUserOwnSelectedPenguin,
    renderStatus,
    hasSomeModifications,
    onRenderClick,
    onCustomizeClick
}: IProps) => {

    if (doUserOwnSelectedPenguin == false) {
        return withWrapper(
            <Control
                title="You don't own this penguin."
                current={true}
            >
                <Button
                    type='primary'
                    link={routeNames.customizeInventory}>
                    Inventory
                </Button>
            </Control >
        );
    }

    const currentStep = ((): Step => {

        if (!hasSomeModifications) {
            return 'modify';
        }

        if (renderStatus === 'rendered') {
            return 'customize';
        } else {
            return 'render';
        }
    })();

    return withWrapper(
        <>
            <div className={style.control + ' ' + (currentStep == 'modify' ? style.current : '')}>
                <p className='ml-2'>Step 1. Make some modifications</p>
                <input type="checkbox" checked={hasSomeModifications} readOnly />
            </div>


            <Control
                title="Step 2. Generate new penguin image"
                current={currentStep == 'render'}
            >
                <Button
                    type='primary'
                    disabled={currentStep != 'render'}
                    onClick={onRenderClick}>
                    Render
                </Button>
            </Control>

            <Control
                title="Step 3. Equip new items"
                current={currentStep == 'customize'}
            >
                <Button
                    type='primary'
                    disabled={currentStep != 'customize'}
                    onClick={onCustomizeClick}>
                    Customize
                </Button>
            </Control>
        </>
    );

}

export default CustomizeControls;

function withWrapper(element: JSX.Element | JSX.Element[]) {
    return <div className={style.controls}>
        <div className={style.content}>
            {element}
        </div>
    </div>;
}

const Control = (
    { children, title, current: current }: { children?: JSX.Element, title: string, current: boolean }) => {

    return <div className={style.control + ' ' + (current ? style.current : '')}>
        <p className='ml-2'>{title}</p>

        <div className={style.content}>

            {children}
        </div>
    </div>
}