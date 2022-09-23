import * as React from 'react';
import { IActivity, IItem } from '@apcolony/marketplace-api';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import { Item } from '../Item/Item';
import style from './ItemsAndActivities.module.scss';

const ItemsAndActivities = ({
    items = [],
    activities,
    className = ''
}: {
    items?: IItem[];
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

    React.useEffect(() => {
        if (items.length === 0) {
            setActiveTab(Tab.Activity);
        }
        else {
            setActiveTab(Tab.Items);
        }
    }, [items])

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

                        if (activities != undefined) {
                            if (activities.length == 0) {
                                return <p>
                                    No activities
                                </p>
                            }
                            else {
                                return (
                                    <>
                                        {activities.map(activity => (
                                            <Activity key={activity.txHash} activity={activity} />
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
    activity: IActivity
}) => {

    function goToExplorer() {
        window.open(`https://explorer.elrond.com/transactions/${activity.txHash}`, '_blank');
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