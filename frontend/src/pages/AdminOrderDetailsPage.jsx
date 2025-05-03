import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import OrderAdminTable from '../components/OrderAdminTable';
import Loading from '../components/Loading';
import SummaryTable from '../components/SummaryTable';

const ActiveOrderContent = ({ data = [] }) => {
    const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
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

    // Handle order deletion with confirmation
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
                navigate('/'); // Redirect to orders list page after deletion
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    // Handle order update
    const onSubmit = async (formData) => {
        try {
            console.log({ id, ...formData });
            const response = await axios.put(
                `/api/order/update_order`,
                { id, ...formData },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token.access_token}`,
                    },
                }
            );
            if (response.status === 200) {
                setIsEditing(false);
                // Update local state with new data
                data.title = formData.title;
                data.description = formData.description;
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    // Toggle edit mode
    const toggleEdit = () => {
        setIsEditing(!isEditing);
        reset({ title, description }); // Reset form to current values
    };

    useEffect(() => {
        const getCompany = async () => {
            const response = await axios.get(`/api/users/companies/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access_token}`,
                },
            });
            setCompanies(response.data);
        };

        getCompany();
    }, [permitted_providers]);

    // Format date
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
                    <p className="text-base font-base text-gray-300 mb-6">
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
