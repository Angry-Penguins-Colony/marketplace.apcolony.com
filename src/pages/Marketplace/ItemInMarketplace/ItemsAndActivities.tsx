import * as React from 'react';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import UnderlineNavElmt from 'components/UnderlineNavElmt/UnderlineNavElmt';
import { Activity as IActivity } from 'pages/Inventory/ItemInInventory/Activity';
import { Item } from './Item';
import style from './items-and-activities.module.scss';

const ItemsAndActivities = ({
    items = [],
    activities,
    className = ''
}: {
    items?: any[];
    activities?: IActivity[];
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
    }

    return (
        <div className={style['item-and-activity'] + ' ' + className}>
            <nav>
                {
                    items.length > 0 && (
                        <UnderlineNavElmt name={'Items'} isActive={activeTab === Tab.Items} onClick={() => changeTab(Tab.Items)} />
                    )
                }
                <UnderlineNavElmt name={'Activity'} isActive={activeTab === Tab.Activity} onClick={() => changeTab(Tab.Activity)} />
            </nav>
            <div className={style.content}>
                {(() => {
                    if (activeTab === Tab.Items) {
                        return (
                            items.map(item => (
                                <Item key={item.id} item={item} />
                            ))
                        );
                    } else if (activeTab === Tab.Activity) {

                        if (activities) {
                            if (activities.length == 0) {
                                return <p>
                                    No activities
                                </p>
                            }
                            else {
                                return (
                                    <>
                                        {activities.map(activity => (
                                            <Activity key={activity.id} activity={activity} />
                                        ))}
                                    </>
                                );
                            }
                        }
                        else {
                            return <div className="d-flex w-100 justify-content-center mt-2">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>;
                        }


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