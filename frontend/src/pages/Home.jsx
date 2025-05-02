import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import LoggedOutContent from '../components/LoggedOutContent';
import LoggedInAdminContent from '../components/LoggedInAdminContent';
import LoggedInUserContent from '../components/LoggedInUserContent';

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [logged] = useAuth();
    const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));

    // Handle to not have redirection on refresh
    useEffect(() => {
        setLoading(false);
    }, [logged]);

    if (loading) {
        return null;
    }
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                {logged ? (
                    token?.role === 'admin' ? (
                        <LoggedInAdminContent />
                    ) : (
                        <LoggedInUserContent />
                    )
                ) : (
                    <LoggedOutContent />
                )}
            </main>
        </div>
    );
};

export default HomePage;
