import * as React from 'react';
import { Link } from 'react-router-dom';
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
                <Link to={routeNames.home}>
                    <Button type='primary'>
                        Back to website
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
