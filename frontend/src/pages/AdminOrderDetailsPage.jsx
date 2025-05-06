import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaCloudDownloadAlt, FaPlay } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderAdminTable from '../components/OrderAdminTable';
import Loading from '../components/Loading';

const ActiveOrderContent = ({ data = [] }) => {
    const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [deadlineError, setDeadlineError] = useState('');

    const {
        id,
        title,
        description,
        status,
        order_items,
        publishing_date,
        permitted_providers,
        participants,
    } = data;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: { title, description },
    });

    const handleDeleteOrder = async () => {
        const confirmed = window.confirm(
            'Вы уверены, что хотите удалить этот заказ?'
        );
        if (!confirmed) return;

        try {
            const response = await axios.delete('/api/order/delete_order', {
                params: { id },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access_token}`,
                },
            });
            if (response.status === 200) {
                toast.success('Заказ успешно удален', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'dark',
                });
                navigate('/');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Не удалось удалить заказ', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
        }
    };

    const onSubmit = async (formData) => {
        try {
            const response = await axios.put(
                `/api/order/update_order_meta?order_id=${id}`,
                { id, ...formData },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token.access_token}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success('Заказ успешно обновлен', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'dark',
                });
                setIsEditing(false);
                data.title = formData.title;
                data.description = formData.description;
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Не удалось обновить заказ', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
        }
    };

    const handleRequestSummary = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `/api/order/get_current_order_state?order_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token.access_token}`,
                    },
                    responseType: 'blob',
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'summary.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error fetching summary:', error);
            toast.error('Не удалось скачать сводку', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartBidding = () => {
        setIsBiddingModalOpen(true);
    };

    const handleBiddingSubmit = async (e) => {
        e.preventDefault();
        if (!deadline) {
            setDeadlineError('Пожалуйста, выберите дедлайн');
            return;
        }

        const selectedDate = new Date(deadline);
        const now = new Date();
        if (selectedDate <= now) {
            setDeadlineError('Дедлайн должен быть в будущем');
            return;
        }

        const isoDeadline = selectedDate.toISOString(); // Преобразование в ISO 8601

        try {
            const response = await axios.post(
                `/api/order/start_bidding?order_id=${id}`,
                { deadline: isoDeadline },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token.access_token}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success('Торги успешно начаты', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'dark',
                });
                setIsBiddingModalOpen(false);
                setDeadline('');
                setDeadlineError('');
            }
        } catch (error) {
            console.error('Error starting bidding:', error);
            toast.error('Не удалось начать торги', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
        }
    };

    const handleBiddingCancel = () => {
        setIsBiddingModalOpen(false);
        setDeadline('');
        setDeadlineError('');
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        reset({ title, description });
    };

    const formattedDate = new Date(publishing_date).toLocaleDateString(
        'ru-RU',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }
    );

    return (
        <>
            {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-base font-base text-white">
                            Название заказа:
                        </label>
                        <input
                            type="text"
                            {...register('title', {
                                required: 'Название обязательно',
                            })}
                            className="w-full mt-2 p-3 bg-[#39393A] text-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="text-base font-base text-white">
                            Описание заказа:
                        </label>
                        <textarea
                            {...register('description')}
                            className="w-full mt-2 p-3 bg-[#39393A] text-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            rows="4"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={toggleEdit}
                            className="w-48 h-12 bg-gray-600 text-white text-base px-6 py-3 rounded-lg font-base hover:bg-gray-700 hover:scale-105 hover:shadow-[0_0_8px_rgba(75,85,99,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                        >
                            Отменить
                        </button>
                        <button
                            type="submit"
                            className="w-48 h-12 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-base px-6 py-3 rounded-lg font-base hover:from-orange-700 hover:to-orange-600 hover:scale-105 hover:shadow-[0_0_8px_rgba(249,115,22,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4 box-border">
                        <h1 className="text-3xl font-base text-white break-words overflow-hidden">
                            {title}
                        </h1>
                        <button
                            onClick={toggleEdit}
                            className="w-48 h-12 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-base px-6 py-3 rounded-lg font-base hover:from-orange-700 hover:to-orange-600 hover:scale-105 hover:shadow-[0_0_8px_rgba(249,115,22,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                        >
                            Редактировать
                        </button>
                    </div>
                    <p className="text-base font-base text-gray-300 mb-4 break-words overflow-auto max-h-48">
                        <strong className="text-base font-base text-white">
                            Описание заказа:
                        </strong>{' '}
                        {description ? description : 'Без описания'}
                    </p>
                    <p className="text-base font-base text-gray-300 mb-4">
                        <strong className="text-base font-base text-white">
                            Статус:
                        </strong>{' '}
                        {status.message}
                    </p>
                    <p className="text-base font-base text-gray-300 mb-6">
                        <strong className="text-base font-base text-white">
                            Дата публикации:
                        </strong>{' '}
                        {formattedDate}
                    </p>
                    <h3 className="text-base font-semibold text-white mb-4">
                        Товары в заказе:
                    </h3>
                    <OrderAdminTable data={order_items} showText={false} />
                    <h3 className="text-base font-semibold text-white mt-6 mb-4">
                        Разрешенные поставщики:
                    </h3>
                    <div className="bg-[#39393A] p-6 rounded-lg mt-4 mb-8 shadow-[0px_0px_0px_1px_rgba(125,125,128)]">
                        <table className="min-w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="text-base font-base text-white px-4 py-2 border-b border-r border-gray-300">
                                        ID поставщика
                                    </th>
                                    <th className="text-base font-base text-white px-4 py-2 border-b">
                                        Участвует
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {permitted_providers &&
                                    participants.map((participant) => {
                                        const isParticipating =
                                            participant.status.code !== 100 &&
                                            participant.status.code !== 111;

                                        return (
                                            <tr key={participant.user.id}>
                                                <td className="text-base font-base text-white px-4 py-2 border-b border-r border-gray-300">
                                                    {participant.user.company}
                                                </td>
                                                <td className="px-4 py-2 border-b text-center">
                                                    {isParticipating
                                                        ? '✅'
                                                        : '❌'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-start gap-4">
                        <button
                            onClick={handleRequestSummary}
                            disabled={isLoading}
                            className={`w-48 h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base font-semibold px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 hover:scale-105 hover:shadow-[0_0_8px_rgba(37,99,235,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200 flex items-center justify-center space-x-2 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Скачать сводку заказа"
                        >
                            {isLoading ? (
                                <span>Загрузка...</span>
                            ) : (
                                <>
                                    <FaCloudDownloadAlt className="text-lg" />
                                    <span>Скачать сводку</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleStartBidding}
                            className="w-48 h-12 bg-gradient-to-r from-green-600 to-green-500 text-white text-base font-semibold px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-600 hover:scale-105 hover:shadow-[0_0_8px_rgba(22,163,74,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200 flex items-center justify-center space-x-2"
                            aria-label="Начать торги"
                        >
                            <FaPlay className="text-lg" />
                            <span>Начать торги</span>
                        </button>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleDeleteOrder}
                            className="w-48 h-12 bg-red-600 text-white text-base px-6 py-3 rounded-lg font-base hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_8px_rgba(220,38,38,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                        >
                            Удалить заказ
                        </button>
                    </div>
                    {/* Модальное окно для ввода дедлайна */}
                    {isBiddingModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-[#39393A] p-6 rounded-lg shadow-lg max-w-md w-full">
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Установить дедлайн для торгов
                                </h2>
                                <form
                                    onSubmit={handleBiddingSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-base font-base text-white">
                                            Дедлайн:
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={deadline}
                                            onChange={(e) => {
                                                setDeadline(e.target.value);
                                                setDeadlineError('');
                                            }}
                                            className="w-full mt-2 p-3 bg-[#222224] text-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                        {deadlineError && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {deadlineError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={handleBiddingCancel}
                                            className="w-32 h-10 bg-gray-600 text-white text-base px-4 py-2 rounded-lg font-base hover:bg-gray-700 hover:scale-105 hover:shadow-[0_0_8px_rgba(75,85,99,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                                        >
                                            Отменить
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-32 h-10 bg-gradient-to-r from-green-600 to-green-500 text-white text-base px-4 py-2 rounded-lg font-base hover:from-green-700 hover:to-green-600 hover:scale-105 hover:shadow-[0_0_8px_rgba(22,163,74,0.6)] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#39393A] transition-all duration-200"
                                        >
                                            Подтвердить
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    backgroundColor: '#39393A',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                progressStyle={{
                    background: 'linear-gradient(to right, #F97316, #F59E0B)',
                }}
            />
        </>
    );
};

const AdminOrderDetailsPage = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getOrderDetails = async () => {
        const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));
        try {
            const response = await axios.get(
                `/api/order/admin_order/${orderId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token.access_token}`,
                    },
                }
            );
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.error('Не удалось загрузить данные о заказе', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrderDetails();
    }, [orderId]);

    return (
        <div className="flex items-center justify-center py-12">
            <div className="bg-[#222224] w-full max-w-4xl p-8 rounded-lg shadow-[0px_0px_1px_0px_rgba(255,255,255)]">
                {loading ? (
                    <Loading />
                ) : orderDetails.id == null ? (
                    <div className="text-center text-base text-white">
                        Нет данных о заказе
                    </div>
                ) : (
                    <ActiveOrderContent data={orderDetails} />
                )}
            </div>
        </div>
    );
};

export default AdminOrderDetailsPage;
