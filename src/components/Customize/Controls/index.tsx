import React from 'react';
import Button from 'components/Abstract/Button/Button';
import style from './index.module.scss';

interface IProps {
    renderStatus?: string;
    hasSomeModifications: boolean;
    onRenderClick: () => void;
    onCustomizeClick: () => void;
}

type Step = 'modify' | 'render' | 'customize';

const CustomizeControls = ({
    renderStatus,
    hasSomeModifications,
    onRenderClick,
    onCustomizeClick
}: IProps) => {

    const currentStep = ((): Step => {

        if (!hasSomeModifications) {
            return 'modify';
        }

        if (renderStatus === 'rendering') {
            return 'customize';
        } else {
            return 'render';
        }
    })();

    return <div className={style.controls}>
        <div className={style.content}>

            <div className={style.control + ' ' + (currentStep == 'modify' ? style.current : '')}>
                <p className='ml-2'>Step 1. Make some modifications</p>
                <input type="checkbox" checked={hasSomeModifications} />
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
        </div>
    </div >;

}

export default CustomizeControls;

const Control = (
    { children, title, current: current }: { children?: JSX.Element, title: string, current: boolean }) => {

    return <div className={style.control + ' ' + (current ? style.current : '')}>
        <p className='ml-2'>{title}</p>

        <div className={style.content}>

            {children}
        </div>
    </div>
}