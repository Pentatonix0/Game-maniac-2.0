import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import PrivateRoute from '../components/PrivateAuth';

// Ленивая загрузка компонентов (без Suspense)
import SignUpPage from './SignUp';
import LoginPage from './Login';
import HomePage from './Home';
import OrderDetails from './OrderDetails';
import CreateOrder from './CreateOrder';
import AdminOrderDetailsPage from './AdminOrderDetailsPage';
import Footer from '../components/Footer';
import UsersPage from './Users';

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
