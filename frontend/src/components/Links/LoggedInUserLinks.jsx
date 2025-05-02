import React from 'react';
import { Link } from 'react-router-dom';
import LogoLink from './LogoLink';
import AccountLink from './AccountLink';

const LoggedInUserLinks = () => {
    return (
        <div className="w-full flex items-center">
            <div className="flex-shrink-0 ">
                <LogoLink />
            </div>
            <div className="flex space-x-6 ml-6">
                <Link className="text-white text-sm hover:underline" to="/">
                    Open orders
                </Link>

                <Link
                    className="text-white text-sm hover:underline"
                    to="/my-orders"
                >
                    My orders
                </Link>
            </div>
            <div className="mr-1 flex-shrink-0 ml-auto">
                <AccountLink />
            </div>
        </div>
    );
};

export default LoggedInUserLinks;
