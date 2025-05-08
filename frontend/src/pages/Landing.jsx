import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/navbar/Navbar';
import Loading from '../components/common/universal_components/Loading';
import PrivateRoute from '../utils/PrivateAuth';

// Ленивая загрузка компонентов (без Suspense)
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import OrderDetails from './OrderDetailsPage';
import CreateOrder from './CreateOrderPage';
import AdminOrderDetailsPage from './AdminOrderDetailsPage';
import Footer from '../components/common/footer/Footer';
import UsersPage from './UsersPage';
import Error404Page from './Error404Page';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/create_order"
                element={
                    <PrivateRoute adminRequired={true}>
                        <CreateOrder />
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<HomePage />} />
            <Route
                path="/order/:orderId"
                element={
                    <PrivateRoute>
                        <OrderDetails />
                    </PrivateRoute>
                }
            />
            <Route
                path="/order_details/:orderId"
                element={
                    <PrivateRoute adminRequired={true}>
                        <AdminOrderDetailsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <PrivateRoute adminRequired={true}>
                        <UsersPage />
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<Error404Page />} />
        </Routes>
    );
};

const Landing = () => {
    return (
        <Router>
            <Navbar />
            <div className="min-h-screen bg-[#18181A] relative">
                <AppRoutes />
            </div>
            <Footer />
        </Router>
    );
};

export default Landing;
