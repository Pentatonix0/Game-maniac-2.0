import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../auth';

const AccountLink = () => (
    <Link
        to="/"
        onClick={() => {
            localStorage.removeItem('tokenRole');
            localStorage.removeItem('tokenUsername');
            localStorage.removeItem('token');
            logout();
        }}
    >
        <img
            src="/account_circle.png"
            alt="Website Logo"
            className="h-8 hover:scale-101" // Размер логотипа (можно настроить)
        />
    </Link>
);

export default AccountLink;
