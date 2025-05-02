import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutContent = () => {
    return (
        <div className="flex flex-col max-w-7xl mx-auto px-20 py-8">
            <h1 className="text-2xl px-3 font-base text-white">
                Welcome to Game Order Platform
            </h1>

            <div className="bg-[#222224] p-8 rounded-3xl shadow-base mt-6 shadow-[0px_0px_1px_0px_rgba(255,255,255)]">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-lg text-white mb-6">
                        Join our platform to participate in game orders,
                        collaborate with other players, and manage your gaming
                        sessions efficiently.
                    </p>

                    <p className="text-gray-400 mb-8">
                        Create an account to get started or login if you already
                        have one. Gain access to exclusive features and manage
                        your orders seamlessly.
                    </p>

                    <div className="flex justify-center gap-6">
                        <Link
                            to="/signup"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl 
                                      transition-colors duration-200 font-medium shadow-sm"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl 
                                      transition-colors duration-200 font-medium shadow-sm"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoggedOutContent;
