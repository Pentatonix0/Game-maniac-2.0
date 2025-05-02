import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OrderAdminTable from '../components/OrderAdminTable';
import Loading from '../components/Loading';
import SummaryTable from '../components/SummaryTable';

const ActiveOrderContent = ({ data = [] }) => {
    const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));
    const [companies, setCompanies] = useState([]);
    const {
        id,
        title,
        description,
        status,
        order_items,
        publishing_date,
        permitted_providers,
        participating_providers, // предполагаем, что это объект или массив
    } = data;
    console.log(permitted_providers);
    console.log(participating_providers);

    useEffect(() => {
        const getCompany = async () => {
            const response = await axios.get(`/api/users/companies/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.access_token}`, // Авторизация через токен
                },
            });
            console.log('test');
            console.log(response.data, 'cnsjkkne');
            setCompanies(response.data);
        };

        getCompany();
    }, [permitted_providers]);

    // Форматируем дату
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
            <h1 className="text-3xl font-base text-white mb-4">{title}</h1>
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
            <p className=" text-base font-base text-gray-300 mb-6">
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
                                            {isParticipating ? '✅' : '❌'}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            <SummaryTable />
        </>
    );
};

const AdminOrderDetailsPage = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);

    const getOrderDetails = async () => {
        const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));
        const response = await axios.get(`/api/order/admin_order/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access_token}`,
            },
        });

        console.log(response.data);
        setOrderDetails(response.data);
        setLoading(false);
    };

    useEffect(() => {
        getOrderDetails();
    }, [orderId]);

    // Если данные еще не загружены или пусты, показываем спиннер
    console.log(orderDetails);
    return (
        <div className="flex items-center justify-center py-12">
            <div className="bg-[#222224] w-full max-w-4xl p-8 rounded-lg  shadow-[0px_0px_1px_0px_rgba(255,255,255)]">
                {loading ? (
                    <Loading />
                ) : (
                    <ActiveOrderContent data={orderDetails} />
                )}
            </div>
        </div>
    );
};

export default AdminOrderDetailsPage;
