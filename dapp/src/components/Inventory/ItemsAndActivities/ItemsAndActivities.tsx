import * as React from 'react';
import { IActivity, IItem } from '@apcolony/marketplace-api';
import lostPenguin from 'assets/img/lost_penguin.svg';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import { explorer } from 'config';
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
                    switch (activeTab) {
                        case Tab.Items:
                            return (
                                items.map(item => (
                                    <Item key={item.id} item={item} />
                                ))
                            );

                        case Tab.Activity:

                            if (activities != undefined) {
                                if (activities.length == 0) {
                                    return <p className="text-center">
                                        This penguin has not been traded on this marketplace yet
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


                        default:
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

        window.open(explorer.getTransaction(activity.txHash), '_blank');
    }

    return (
        <div className={style.activity} onClick={goToExplorer}>
            <div className={style.controls}>
                <RightArrowIcon className={style['arrow-icon']} />
            </div>
            <p className={style['main-info']}>
                {activity.buyer.slice(0, 6) + '...' + activity.buyer.slice(-6)} brought for {activity.price} EGLD
            </p>
            <p className={style.since}>{new Date(activity.date * 1000).toISOString().slice(0, 10)}</p>
            <p className={style['see-it']}>See it now</p>
        </div >
    );
}