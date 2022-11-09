import * as React from 'react';
import { IActivity, IItem } from '@apcolony/marketplace-api';
import moment from 'moment';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import AddressWrapper from 'components/AddressWrapper';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import { explorer } from 'config';
import { Item } from '../Item/Item';
import style from './ItemsAndActivities.module.scss';

const ItemsAndActivities = ({
    items = [],
    activities,
    className = '',
    type,
    disableActivityTab = false
}: {
    items?: IItem[];
    activities?: IActivity[];
    className?: string,
    disableActivityTab?: boolean
    type: string
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

    React.useEffect(() => {
        if (disableActivityTab == true && activeTab == Tab.Activity) {
            setActiveTab(Tab.Items);
        }
    }, [activeTab]);


    return (
        <div className={style['item-and-activity'] + ' ' + className}>
            <nav>
                {
                    items.length > 0 && (
                        <UnderlineNavElmt name={'Items'} isActive={activeTab === Tab.Items} onClick={() => changeTab(Tab.Items)} />
                    )
                }
                {
                    !disableActivityTab && (
                        <UnderlineNavElmt name={'Activity'} isActive={activeTab === Tab.Activity} onClick={() => changeTab(Tab.Activity)} />
                    )
                }
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
                                        This {type} has not been traded on this marketplace yet
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


    return (
        <div className={style.activity}>
            <div className={style.controls}>
                <RightArrowIcon className={style['arrow-icon']} />
            </div>
            <p className={style['main-info']}>
                {activity.price} EGLD
            </p>
            <p className={style.since}>
                {moment(new Date(activity.date * 1000)).fromNow()}
            </p>
            <div className={style['details']}>

                <p><span className={style.prefix}>From</span> <AddressWrapper bech32={activity.seller} /></p>
                <p><span className={style.prefix}>To</span> <AddressWrapper bech32={activity.buyer} /></p>
            </div>
        </div >
    );
}