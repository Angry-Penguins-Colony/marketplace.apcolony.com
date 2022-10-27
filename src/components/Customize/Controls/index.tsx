import React from 'react';
import Button from 'components/Abstract/Button/Button';
import style from './index.module.scss';

interface IProps {
    renderStatus?: string;
    hasSomeModifications: boolean;
    onRenderClick: () => void;
    onCustomizeClick: () => void;
}

const CustomizeControls = ({
    renderStatus,
    hasSomeModifications,
    onRenderClick,
    onCustomizeClick
}: IProps) => {

    const showSteps = {
        'modify': hasSomeModifications,
        'render': renderStatus == 'none',
        'customize': renderStatus == 'rendered' && hasSomeModifications
    };

    const completeSteps = {
        'modify': hasSomeModifications,
        'render': renderStatus != undefined && renderStatus != 'none',
        'customize': false
    }

    return <div className={style.controls}>
        <div className={style.content}>

            <div className={style.control + ' ' + (completeSteps['modify'] ? style.completed : '')}>
                <p className='ml-2'>Step 1. Make some modifications</p>
                <input type="checkbox" checked={showSteps['modify']} />
            </div>


            <Control
                title="Step 2. Generate new penguin image"
                completed={completeSteps['render']}
            >
                <Button
                    type='primary'
                    disabled={!showSteps['render']}
                    onClick={onRenderClick}>
                    Render
                </Button>
            </Control>

            <Control
                title="Step 3. Equip new items"
                completed={completeSteps['customize']}
            >
                <Button
                    type='primary'
                    disabled={!showSteps['customize']}
                    onClick={onCustomizeClick}>
                    Customize
                </Button>
            </Control>
        </div>
    </div >;
}

export default CustomizeControls;

const Control = (
    { children, title, completed }: { children?: JSX.Element, title: string, completed: boolean }) => {

    return <div className={style.control + ' ' + (completed ? style.completed : '')}>
        <p className='ml-2'>{title}</p>

        <div className={style.content}>

            {children}
        </div>
    </div>
}