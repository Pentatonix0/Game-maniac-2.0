import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth'; // Предполагаем, что useAuth возвращает состояние авторизации
import Error404 from './Error404';

const PrivateRoute = ({ children, adminRequired = false }) => {
    const [loading, setLoading] = useState(true);
    const [logged] = useAuth();
    const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));
    const isAdmin = token.role === 'admin';

    // Handle to not have redirection on refresh
    useEffect(() => {
        setLoading(false);
    }, [logged]);

    if (loading) {
        return null;
    }
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (
        !logged ||
        (adminRequired && !isAdmin) ||
        (logged && !adminRequired && isAdmin)
    ) {
        return <Error404 />;
    }

    // Если авторизован — отображаем дочерние компоненты
    return children;
};

export default PrivateRoute;
