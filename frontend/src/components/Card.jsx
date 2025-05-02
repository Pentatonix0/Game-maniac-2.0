import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IsPartisipating from './Participating';

const ProviderCard = ({
    orderId,
    title,
    description,
    bidding_deadline,
    status = 0,
}) => {
    const [timeLeft, setTimeLeft] = useState('');

    const padNumber = (num) => num.toString().padStart(2, '0');

    useEffect(() => {
        if (!bidding_deadline) return;

        const deadlineDate = new Date(bidding_deadline);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = deadlineDate - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('');
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(
                `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(
                    seconds
                )}`
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [bidding_deadline]);

    return (
        <div
            className="bg-[#39393A] p-6 rounded-xl border border-gray-600 w-162 h-54 flex flex-col hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(209,209,209,0.5)] transition-all duration-300 animate-slide-in"
            aria-label={`Order ${title}`}
        >
            <div className="flex justify-between">
                <div>
                    <h2 className="text-xl font-base text-[#d1d1d1] mb-4 animate-fade-in">
                        {title}
                    </h2>
                </div>
                <div>
                    {bidding_deadline ? (
                        <span
                            className="text-[#FAED27] font-base text-sm animate-pulse-slow"
                            aria-live="polite"
                        >
                            {timeLeft}
                        </span>
                    ) : (
                        status === 100 && (
                            <span className="text-red-500 animate-pulse font-bold text-xl">
                                NEW!
                            </span>
                        )
                    )}
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-6 flex-grow whitespace-pre-line animate-fade-in">
                {description}
            </p>
            <IsPartisipating orderId={orderId} status={status} />
        </div>
    );
};

const AdminCard = ({ orderId, title, description }) => {
    return (
        <div
            className="bg-[#39393A] p-6 rounded-xl border border-gray-600 w-162 h-54 flex flex-col hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(209,209,209,0.5)] transition-all duration-300 animate-slide-in"
            aria-label={`Order ${title}`}
        >
            <h2 className="text-lg font-semibold text-[#d1d1d1] mb-4 animate-fade-in">
                {title}
            </h2>
            <p className="text-sm text-gray-500 mb-6 flex-grow whitespace-pre-line animate-fade-in">
                {description}
            </p>
            <div className="flex justify-end mt-auto">
                <Link to={`/order_details/${orderId}`}>
                    <button
                        className="bg-[#FF5F00] text-white text-base px-6 py-3 rounded-lg font-base hover:bg-red-600 hover:scale-105 hover:shadow-[0_0_8px_rgba(255,95,0,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                        aria-label="View order details"
                    >
                        Подробности
                    </button>
                </Link>
            </div>
        </div>
    );
};

const OrderCard = ({
    orderId,
    title,
    description,
    status,
    bidding_deadline,
    isAdmin = false,
}) => {
    return (
        <>
            {isAdmin ? (
                <AdminCard
                    orderId={orderId}
                    title={title}
                    description={description}
                />
            ) : (
                <ProviderCard
                    orderId={orderId}
                    title={title}
                    description={description}
                    bidding_deadline={bidding_deadline}
                    status={status}
                />
            )}
        </>
    );
};

export default React.memo(OrderCard);
