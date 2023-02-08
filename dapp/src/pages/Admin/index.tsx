import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useAddBodyClassNames from 'sdk/hooks/useAddBodyClassNames';
import style from './index.module.scss';
import { tools } from './tools';


const Admin = () => {

    const activeTool = useActiveTool();


    useAddBodyClassNames(['no-footer']);

    return <div id={style.admin}>

        <div className='container-fluid mt-3'>
            <div className='row justify-content-between'>
                <div className='col-auto list-group pl'>
                    <div className='list-group-item text-center flex-column align-items-start list-group-item-primary '>
                        {activeTool != undefined ? 'TOOLS' : 'Select a tool'}
                    </div>
                    {tools.map((tool) => (
                        <Link className={'list-group-item list-group-item-action flex-column align-items-start' + ' ' + (tool.route == activeTool ? 'active' : '')} key={tool.route} to={tool.route}>
                            {tool.name}
                        </Link>
                    ))}
                </div>
                <div className={'col bg-light border p-5'}>
                    <Outlet />
                </div>
            </div>
        </div>
    </div>;
};

export default Admin;


const useActiveTool = () => {
    const location = useLocation();
    const lastRoute = location.pathname.split('/').pop();

    return tools.find((tool) => tool.route === lastRoute)?.route;
};