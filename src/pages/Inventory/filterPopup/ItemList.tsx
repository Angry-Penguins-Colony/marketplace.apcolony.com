import * as React from 'react';
import ToggleIcon from 'components/Icons/ToggleIcon';
import { Attribute } from './Attribute';
import style from './item-list.module.scss';

export const ItemList = ({
    className = '', icon, title, attributes = [],
    value, toggleAttribute = function () {
        // do nothing
    }
}: {
    className?: string;
    icon: string;
    title: string;
    attributes?: any[];
    value: string;
    toggleAttribute?: (attribute: any, item: any) => void;
}) => {

    const [isOpen, setIsOpen] = React.useState(false);

    function toggle() {
        setIsOpen(!isOpen);
    }

    return (
        <div className={style['item-list'] + ' ' + className + ' ' + (isOpen ? style.open : style.close)}>
            <div className={style.header} onClick={toggle}>
                <div className={style.icon}>
                    <img src={icon} alt={title} />
                </div>
                <div className={style.name}>{title}</div>
                <div className={style.toggle}>
                    <ToggleIcon />
                </div>
            </div>
            <div className={style.content}>
                {attributes.map(attr => (
                    <Attribute
                        key={attr.value}
                        name={attr.name}
                        number={attr.number}
                        value={attr.value}
                        isSelected={attr.isSelected}
                        isTmpSelected={attr.isTmpSelected}
                        toggle={() => toggleAttribute(attr.value, value)} />
                ))}
            </div>
        </div>
    );
};
