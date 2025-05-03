import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import LoggedOutContent from '../components/LoggedOutContent';
import LoggedInAdminContent from '../components/LoggedInAdminContent';
import LoggedInUserContent from '../components/LoggedInUserContent';
import UsersPageContent from '../components/UsersPageContent';

const UsersPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <UsersPageContent />
            </main>
        </div>
    );
};

export default UsersPage;
