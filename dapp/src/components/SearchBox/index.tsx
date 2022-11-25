import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    className?: string;
    onSearch: (search: string) => void;
    showButton?: boolean;
}

export const SearchBox = ({
    className = '',
    onSearch,
    showButton = false
}: Props) => {
    return (
        <div className='d-flex'>
            <input type="text" className={'form-control' + ' ' + className} name="x" id="search" placeholder="Type to search" onChange={(e) => onSearch(e.target.value)} />

            {showButton &&
                <span className="input-group-btn">
                    <button className="btn btn-default" type="button">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </span>
            }
        </div>
    );
};