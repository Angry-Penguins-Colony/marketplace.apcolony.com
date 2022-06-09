import * as React from 'react';
import style from './navigation-type.module.scss';

const NavigationType = ({
    className = ''
}: {
    className?: string
}) => {
    return (
        <section id={style['navigation-type']} className={className}>
            <span className={style.item + ' ' + style.active}>Penguins</span>
            <span className={style.item}>Eggs</span>
            <span className={style.item}>items</span>
        </section>
    );
};

export default NavigationType;
