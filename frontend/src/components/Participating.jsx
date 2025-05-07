import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * Константы для стилей и статусов
 */
const STATUS_CLASSES = {
    100: {
        button: 'bg-[#FF5F00] text-white hover:bg-red-600 hover:shadow-[0_0_8px_rgba(255,95,0,0.6)] focus:ring-orange-500',
        text: 'text-red-500 animate-pulse font-bold text-xl',
        label: 'NEW!',
    },
    101: {
        button: 'bg-[#39393A] border-2 border-indigo-400 hover:bg-[#4A4A4C] hover:shadow-[0_0_8px_rgba(99,102,241,0.6)] focus:ring-indigo-400',
        text: 'text-indigo-400',
        label: 'You are participating',
    },
    102: {
        button: 'bg-[#39393A] border-2 border-indigo-400 hover:bg-[#4A4A4C] hover:shadow-[0_0_8px_rgba(99,102,241,0.6)] focus:ring-indigo-400',
        text: 'text-indigo-400',
        label: 'You are participating',
    },
    103: {
        button: 'bg-[#39393A] border-2 border-[#faed27] hover:bg-[#4A4A4C] hover:shadow-[0_0_8px_rgba(250,237,39,0.6)] focus:ring-[#faed27]',
        text: 'text-[#faed27]',
        label: 'You can offer a lower price',
    },
    104: {
        button: 'bg-[#39393A] border-2 border-[#faed27] hover:bg-[#4A4A4C] hover:shadow-[0_0_8px_rgba(250,237,39,0.6)] focus:ring-[#faed27]',
        text: 'text-[#faed27]',
        label: 'You can offer a lower price',
    },
};

const COMMON_BUTTON_CLASSES =
    'w-32 py-3 text-white text-base rounded-lg font-base hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181A] transition-all duration-200';

const CARD_CLASSES =
    'bg-[#39393A] p-6 rounded-xl border border-gray-600 w-162 h-54 flex flex-col hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(209,209,209,0.5)] transition-all duration-300 animate-slide-in box-border';

/**
 * Хук для управления таймером дедлайна
 * @param {string|null} bidding_deadline - Дедлайн в формате ISO 8601 (UTC)
 * @param {number} orderId - ID заказа
 * @param {number} status - Код статуса участника
 * @returns {string} - Оставшееся время или сообщение
 */
const useTimer = (bidding_deadline, orderId, status) => {
    const [timeLeft, setTimeLeft] = useState('');

    const padNumber = (num) => String(num).padStart(2, '0');

    useEffect(() => {
        if (!bidding_deadline) {
            setTimeLeft('');
            return;
        }

        // Проверка валидности дедлайна
        const deadlineDate = new Date(bidding_deadline + 'Z');
        if (isNaN(deadlineDate)) {
            setTimeLeft('Invalid deadline');
            return;
        }

        let hasSentRequest = false; // Флаг для предотвращения повторных запросов

        const timer = setInterval(() => {
            const now = new Date();
            const distance = deadlineDate - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('The deadline has expired');

                // Отправляем POST-запрос только один раз
                if (!hasSentRequest && status !== 105) {
                    hasSentRequest = true;
                    const token = JSON.parse(
                        localStorage.getItem('REACT_TOKEN_AUTH_KEY')
                    );
                    if (token?.access_token) {
                        axios
                            .post(
                                '/api/order/set_participant_status',
                                {
                                    order_id: orderId,
                                    status_code: 105,
                                },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token.access_token}`,
                                    },
                                }
                            )
                            .then((response) => {
                                if (response.status === 200) {
                                    window.location.reload();
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    'Error setting participant status:',
                                    error
                                );
                            });
                    }
                }
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
    }, [bidding_deadline, orderId, status]);

    return timeLeft;
};

/**
 * Компонент для отображения статуса участия
 * @param {Object} props
 * @param {number} props.orderId - ID заказа
 * @param {number} props.status - Код статуса участника
 */
const ParticipationStatus = ({ orderId, status }) => {
    const statusConfig = STATUS_CLASSES[status] || {};

    switch (status) {
        case 100:
            return (
                <div className="flex justify-end animate-slide-in">
                    <Link to={`/order/${orderId}`}>
                        <button
                            className={`${COMMON_BUTTON_CLASSES} ${statusConfig.button}`}
                            aria-label="Participate in order"
                        >
                            Participate
                        </button>
                    </Link>
                </div>
            );
        case 101:
        case 102:
            return (
                <div className="flex justify-between items-center animate-slide-in">
                    <div
                        className={`mt-6 text-xs font-base ${statusConfig.text} animate-fade-in`}
                    >
                        {statusConfig.label}
                    </div>
                    <div className="w-32">
                        <Link to={`/order/${orderId}`}>
                            <button
                                className={`${COMMON_BUTTON_CLASSES} ${statusConfig.button}`}
                                aria-label="View order details"
                            >
                                Details
                            </button>
                        </Link>
                    </div>
                </div>
            );
        case 103:
        case 104:
            return (
                <div className="flex justify-between items-center animate-slide-in">
                    <div
                        className={`mt-6 text-xs font-base ${statusConfig.text} animate-fade-in`}
                    >
                        {statusConfig.label}
                    </div>
                    <div className="w-32">
                        <Link to={`/order/${orderId}`}>
                            <button
                                className={`${COMMON_BUTTON_CLASSES} ${statusConfig.button}`}
                                aria-label="Offer a lower price"
                            >
                                Offer
                            </button>
                        </Link>
                    </div>
                </div>
            );
        default:
            return <span className="text-gray-400">{status}</span>;
    }
};

/**
 * Карточка заказа для поставщика
 * @param {Object} props
 * @param {number} props.orderId - ID заказа
 * @param {string} props.title - Название заказа
 * @param {string} props.description - Описание заказа
 * @param {string|null} props.bidding_deadline - Дедлайн торгов (UTC)
 * @param {number} props.status - Код статуса участника
 */
const ProviderCard = ({
    orderId,
    title,
    description,
    bidding_deadline,
    status = 0,
}) => {
    const timeLeft = useTimer(bidding_deadline, orderId, status);

    return (
        <div className={CARD_CLASSES} aria-label={`Order ${title}`}>
            <div className="flex justify-between">
                <div className="w-full">
                    <h2 className="text-xl font-base text-[#d1d1d1] mb-4 animate-fade-in break-words overflow-hidden">
                        {title}
                    </h2>
                </div>
                <div>
                    {bidding_deadline ? (
                        <span
                            className="text-[#FAED27] font-base text-sm animate-pulse-slow"
                            aria-live="polite"
                        >
                            {timeLeft || 'No deadline'}
                        </span>
                    ) : (
                        status === 100 && (
                            <span className={STATUS_CLASSES[100].text}>
                                {STATUS_CLASSES[100].label}
                            </span>
                        )
                    )}
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-6 flex-grow animate-fade-in break-words overflow-auto max-h-24">
                {description}
            </p>
            <ParticipationStatus orderId={orderId} status={status} />
        </div>
    );
};

/**
 * Карточка заказа для администратора
 * @param {Object} props
 * @param {number} props.orderId - ID заказа
 * @param {string} props.title - Название заказа
 * @param {string} props.description - Описание заказа
 */
const AdminCard = ({ orderId, title, description }) => {
    return (
        <div className={CARD_CLASSES} aria-label={`Order ${title}`}>
            <h2 className="text-lg font-semibold text-[#d1d1d1] mb-4 animate-fade-in break-words overflow-hidden">
                {title}
            </h2>
            <p className="text-sm text-gray-500 mb-6 flex-grow animate-fade-in break-words overflow-auto max-h-24">
                {description}
            </p>
            <div className="flex justify-end mt-auto">
                <Link to={`/order_details/${orderId}`}>
                    <button
                        className="bg-[#FF5F00] text-white text-base px-6 py-3 rounded-lg font-base hover:bg-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                        aria-label="View order details"
                    >
                        Подробности
                    </button>
                </Link>
            </div>
        </div>
    );
};

/**
 * Основной компонент карточки заказа
 * @param {Object} props
 * @param {number} props.orderId - ID заказа
 * @param {string} props.title - Название заказа
 * @param {string} props.description - Описание заказа
 * @param {number} props.status - Код статуса участника
 * @param {string|null} props.bidding_deadline - Дедлайн торгов (UTC)
 * @param {boolean} props.isAdmin - Флаг администратора
 */
const OrderCard = ({
    orderId,
    title,
    description,
    status,
    bidding_deadline,
    isAdmin = false,
}) => {
    return isAdmin ? (
        <AdminCard orderId={orderId} title={title} description={description} />
    ) : (
        <ProviderCard
            orderId={orderId}
            title={title}
            description={description}
            bidding_deadline={bidding_deadline}
            status={status}
        />
    );
};

export default React.memo(OrderCard);
