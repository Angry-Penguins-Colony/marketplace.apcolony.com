import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    className?: string;
    onSearch: (search: string) => void;
}

export const SearchBox = ({
    className = '',
    onSearch,
}: Props) => {
    return (
        <div className='d-flex'>
            <input type="text" className={'form-control' + ' ' + className} name="x" id="search" placeholder="Search" onChange={(e) => onSearch(e.target.value)} />
            <span className="input-group-btn">
                <button className="btn btn-default" type="button">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </span>
        </div>
    );
};