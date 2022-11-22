import * as React from 'react';
import { IActivity, IItem } from '@apcolony/marketplace-api';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import UnderlineNavElmt from 'components/Abstract/UnderlineNavElmt/UnderlineNavElmt';
import AddressWrapper from 'components/AddressWrapper';
import RightArrowIcon from 'components/Icons/RightArrowIcon';
import { HorizontalItem } from '../HorizontalItem';
import style from './ItemsAndActivities.module.scss';

const ItemsAndActivities = ({
    items,
    activities,
    className = '',
    type,
    disableActivityTab = false,
    disableItemsTab = false
}: {
    items?: IItem[];
    activities?: IActivity[];
    className?: string,
    disableActivityTab?: boolean
    disableItemsTab?: boolean
    type: string
}) => {
    // change active tab
    enum Tab {
        Items = 'items',
        Activity = 'activity'
    }

    const [activeTab, setActiveTab] = React.useState<Tab>(Tab.Items);

    function changeTab(tab: Tab) {
        setActiveTab(tab);
    }

    React.useEffect(() => {
        if (!items) return;

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

        if (disableItemsTab == true && activeTab == Tab.Items) {
            setActiveTab(Tab.Activity);
        }
    }, [activeTab]);


    return (
        <div className={style['item-and-activity'] + ' ' + className}>
            <nav>
                {!disableItemsTab &&
                    <UnderlineNavElmt name={'Items'} isActive={activeTab === Tab.Items} onClick={() => changeTab(Tab.Items)} />
                }

                {
                    !disableActivityTab && (
                        <UnderlineNavElmt name={'Activity'} isActive={activeTab === Tab.Activity} onClick={() => changeTab(Tab.Activity)} />
                    )
                }
            </nav>
            <div className={style.content + ' ' + getTabClassName()}>
                {getContent()}
            </div>
        </div>
    );

    function getContent(): React.ReactNode {
        switch (activeTab) {
            case Tab.Items:
                if (!items) {
                    return <>
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                    </>;
                }

                return (
                    items.map(item => (
                        <HorizontalItem key={item.id} item={item} subProperty={'#' + item.id} />
                    ))
                );

            case Tab.Activity:

                if (activities != undefined) {
                    if (activities.length == 0) {
                        return <p className="text-center">
                            This {type} has not been traded on this marketplace yet
                        </p>;
                    }
                    else {
                        return (
                            <>
                                {activities
                                    .sort((a, b) => a.date > b.date ? -1 : 1)
                                    .map(activity => (
                                        <Activity key={activity.txHash} activity={activity} />
                                    ))}
                            </>
                        );
                    }
                }
                else {
                    return <>
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                        <Skeleton height={80} />
                    </>;
                }


            default:
                return (<></>);
        }
    }

    function getTabClassName() {
        return style[`${activeTab}Tab`];
    }
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