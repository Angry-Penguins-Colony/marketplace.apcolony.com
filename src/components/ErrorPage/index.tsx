import * as React from 'react';
import Button from 'components/Abstract/Button/Button';
import { routeNames } from 'routes';
import lostPenguin from './../../assets/img/lost_penguin.svg';
import style from './style.module.scss';

interface Prop {
    title: string;
    description: string;
}

const ErrorPage = ({ title, description }: Prop) => {
    return (
        <div className={style['error-page']}>
            <div className={style.content}>
                <img src={lostPenguin} alt="Penguin is lost" />
                <h1>{title}</h1>
                <p>{description}</p>
                <Button type='primary' onClick={() => {
                    window.location.href = routeNames.home;
                }}>Back to website</Button>
            </div>
        </div>
    );
};

export default ErrorPage;
