import * as React from 'react';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import { Item } from './Item';
import style from './items-and-activities.module.scss';

const ItemsAndActivities = ({
    getActivities,
    items = [],
    activities,
    className = ''
}: {
    getActivities: () => void;
    items?: any[];
    activities: any[];
    className?: string
}) => {
    // change active tab
    enum Tab {
        Items = 'items',
        Activity = 'activity'
    }

    const [activeTab, setActiveTab] = React.useState<Tab>(
        (items.length > 0 ? Tab.Items : Tab.Activity)
    );

    function changeTab(tab: Tab) {
        setActiveTab(tab);
        if (tab === Tab.Activity) {
            getActivities();
        }
    }

    if (activeTab === Tab.Activity) {
        getActivities();
    }

    return (
        <div className={style['item-and-activity'] + ' ' + className}>
            <nav>
                {/* TODO: bind click to change content */}
                {
                    items.length > 0 && (
                        <div className={style.elmt + (activeTab === Tab.Items ? ' ' + style.active : '')} onClick={() => changeTab(Tab.Items)}>Items</div>
                    )
                }
                <div className={style.elmt + (activeTab === Tab.Activity ? ' ' + style.active : '')} onClick={() => changeTab(Tab.Activity)}>Activity</div>
            </nav>
            <div className={style.content}>
                {(() => {
                    if (activeTab === Tab.Items) {
                        // activeTab === Tab.Items ? 
                        return (
                            items.map(item => (
                                <Item key={item.id} item={item} />
                            ))
                        );
                    } else if (activeTab === Tab.Activity) {
                        return (
                            <>
                                {activities.map(activity => (
                                    <Activity key={activity.id} activity={activity} />
                                ))}
                            </>
                        );
                    } else {
                        return (<></>);
                    }
                })()}
            </div>
        </div>
    );
};

export default ItemsAndActivities;

const Activity = ({
    activity
}: {
    activity: {
        id: string,
        price: number,
        from: string,
        to: string,
        date: string
    }
}) => {

    function goToExplorer() {
        window.open(`https://explorer.elrond.com/transactions/${activity.id}`, '_blank');
    }

    return (
        <div className={style.activity} onClick={goToExplorer}>
            <div className={style.controls}>
                <RightArrowIcon className={style['arrow-icon']} />
            </div>
            <p className={style['main-info']}><span className={style.from}>{activity.from}</span> brought for {activity.price} EGLD</p>
            <p className={style.since}>{activity.date}</p>
            <p className={style['see-it']}>See it now</p>
        </div>
    );
}