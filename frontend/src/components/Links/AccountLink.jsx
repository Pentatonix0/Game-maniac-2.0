import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../utils/auth';

const AccountLink = () => (
    <Link
        to="/"
        onClick={() => {
            localStorage.removeItem('tokenRole');
            localStorage.removeItem('tokenUsername');
            localStorage.removeItem('token');
            logout();
        }}
        className="text-sm text-white hover:underline"
    >
        {/* <img
            src="/account_circle.png"
            alt="Website Logo"
            className="h-8 hover:scale-101" // Размер логотипа (можно настроить)
        /> */}
        Log out
    </Link>
);

export default AccountLink;
