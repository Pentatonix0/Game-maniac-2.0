import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderAdminTable from '../components/OrderAdminTable';
import Loading from '../components/Loading';
import SummaryTable from '../components/SummaryTable';

const ActiveOrderContent = ({ data = [] }) => {
    const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        id,
        title,
        description,
        status,
        order_items,
        publishing_date,
        permitted_providers,
        participating_providers,
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
            toast.success('Сводка успешно скачана', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
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

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        reset({ title, description });
    };

    useEffect(() => {
        const getCompany = async () => {
            try {
                const response = await axios.get(`/api/users/companies/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token.access_token}`,
                    },
                });
                setCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
                toast.error('Не удалось загрузить данные о поставщиках', {
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

        getCompany();
    }, [permitted_providers]);

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
                            className="w-48 h-12 bg-gray-600 text-white text-base px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
                        >
                            Отменить
                        </button>
                        <button
                            type="submit"
                            className="w-48 h-12 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-base px-6 py-3 rounded-lg hover:from-orange-700 hover:to-orange-600 transition duration-200"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-base text-white">
                            {title}
                        </h1>
                        <button
                            onClick={toggleEdit}
                            className="w-48 h-12 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-base px-6 py-3 rounded-lg hover:from-orange-700 hover:to-orange-600 transition duration-200"
                        >
                            Редактировать
                        </button>
                    </div>
                    <p className="text-base font-base text-gray-300 mb-4">
                        <strong className="text-base font-base text-white">
                            Описание заказа:
                        </strong>{' '}
                        {description ? `\n${description}` : 'Без описания'}
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
                                    companies.map((company) => {
                                        const isParticipating =
                                            participating_providers.includes(
                                                company.user_id
                                            );

                                        return (
                                            <tr key={company.user_id}>
                                                <td className="text-base font-base text-white px-4 py-2 border-b border-r border-gray-300">
                                                    {company.company_name}
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
                    <SummaryTable />
                    <div className="mt-6">
                        <button
                            onClick={handleRequestSummary}
                            disabled={isLoading}
                            className={`w-48 h-12 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-base font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 flex items-center justify-center space-x-2 ${
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
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleDeleteOrder}
                            className="w-48 h-12 bg-red-600 text-white text-base px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200"
                        >
                            Удалить заказ
                        </button>
                    </div>
                </>
            )}
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
                        background:
                            'linear-gradient(to right, #F97316, #F59E0B)',
                    }}
                />
            </div>
        </div>
    );
};

export default AdminOrderDetailsPage;
