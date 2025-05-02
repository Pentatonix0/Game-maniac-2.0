import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import OrderAdminTable from '../components/OrderAdminTable';
import ProvidersList from '../components/OrderAdminProvidersList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Функция для получения текущей даты в нужном формате
const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Добавляем ведущий ноль
    const day = today.getDate().toString().padStart(2, '0'); // Добавляем ведущий ноль
    return `${year}-${month}-${day}`;
};

const CreateOrder = () => {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState([]); // состояние для хранения данных, полученных с сервера
    const [selectedProviders, setSelectedProviders] = useState([]);
    const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY'));

    const createOrder = async (data) => {
        // Логика для создания заказа

        // Проверяем, что хотя бы один заказчик выбран
        const allFalse = Object.values(selectedProviders).every(
            (value) => value === false
        );

        let showWarning = false;

        if (allFalse) {
            toast.warning('Должен быть выбран хотя бы один заказчик!', {
                position: 'top-right',
                autoClose: 3000,
            });
            showWarning = true; // Поставим флаг для предупреждения
        }

        // Проверяем, что файл добавлен
        if (orderData.length === 0) {
            toast.warning('Необходимо добавить файл', {
                position: 'top-right',
                autoClose: 3000,
            });
            showWarning = true; // Поставим флаг для предупреждения
        }

        // Если прошло хотя бы одно предупреждение, прекращаем выполнение функции
        if (showWarning) {
            return; // Прерываем выполнение функции, если есть предупреждения
        }

        // Логика запроса, если все проверки пройдены
        console.log(selectedProviders);

        const body = {
            title: data.title,
            description: data.description,
            status: 200,
            order_items: orderData,
            permitted_providers: selectedProviders,
        };

        console.log(body);
        try {
            const response = await axios.post(
                '/api/order/create_admin_order',
                body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token.access_token}`,
                    },
                }
            );
            reset();
            navigate('/');

            // Обработка данных, возвращаемых сервером
            setOrderData(response.data); // Сохраняем полученные данные в состоянии
        } catch (error) {
            toast.error('Ошибка при создании заказа', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    // Генерация значения по умолчанию для названия заказа
    const defaultOrderTitle = `Order ${getCurrentDate()}`;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: defaultOrderTitle, // Устанавливаем значение по умолчанию
        },
    });

    const handleInputChange = (e) => {
        // Автоматическое увеличение высоты текста при вводе
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleFileChange = async (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]); // Отправляем файл на сервер

        try {
            const response = await axios.post(
                '/api/excel/excel_process',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // указываем правильный тип контента
                        Authorization: `Bearer ${token.access_token}`, // Добавляем токен в заголовок
                    },
                }
            );

            // Обработка данных, возвращаемых сервером
            setOrderData(response.data); // Сохраняем полученные данные в состоянии
        } catch (error) {
            console.log(error);
            setOrderData([]);
            toast.error('Ошибка при чтении файла!', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <div className="px-24 py-8">
                <div className="flex items-center justify-center">
                    <ToastContainer />
                    <div className="bg-[#222224] w-full p-8 rounded-3xl shadow-[0px_0px_1px_0px_rgba(255,255,255)]">
                        <div className="px-10">
                            <h1 className="text-3xl text-white font-base text-center text-gray-800 mb-4">
                                Создание нового заказа
                            </h1>
                            <h2 className="text-xl text-center font-base text-gray-300 mb-6">
                                Информация о заказе
                            </h2>

                            <form
                                onSubmit={handleSubmit(createOrder)}
                                className="space-y-6"
                            >
                                <InputField
                                    id="title"
                                    label="Название заказа"
                                    type="text"
                                    register={register}
                                    errors={errors}
                                    validation={{
                                        required: 'Название обязательно',
                                        maxLength: {
                                            value: 80,
                                            message:
                                                'Название не может быть длиннее 80 символов',
                                        },
                                    }}
                                    labelTextColor="gray-300"
                                />
                                <div className="space-y-2">
                                    <label
                                        htmlFor="description"
                                        className="block text-gray-300 text-base font-base"
                                    >
                                        Описание заказа
                                    </label>
                                    <textarea
                                        id="description"
                                        {...register('description', {
                                            maxLength: {
                                                value: 240,
                                                message:
                                                    'Описание не может быть длиннее 240 символов',
                                            },
                                        })}
                                        onInput={handleInputChange}
                                        rows={3} // Начальная высота
                                        className={`mt-1 p-2 w-full text-base border rounded-md border-gray-200 bg-gray-300
                                            focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                        placeholder="Введите описание..."
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                {/* Элемент для загрузки файла */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="file"
                                        className="block text-base text-gray-300 font-base"
                                    >
                                        Загрузить файл
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        onChange={handleFileChange}
                                        className={`mt-1 p-2 w-full border rounded-md text-gray-300 text-sm font-base border-gray-400 bg-[#222224]
                                            focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                    />
                                </div>

                                <OrderAdminTable data={orderData} />

                                {/* Элемент для кастомизации пользователей */}
                                <div>
                                    <h3 className="text-base text-gray-300 text-base font-base">
                                        Список поставщиков
                                    </h3>
                                    <ProvidersList
                                        selectedProviders={selectedProviders}
                                        setSelectedProviders={
                                            setSelectedProviders
                                        }
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Создать заказ
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateOrder;
