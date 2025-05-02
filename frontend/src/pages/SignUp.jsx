import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth';
import InputField from '../components/InputField';

const SignUpPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Состояния для полей
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        company: '',
        password: '',
        confirmPassword: '',
    });
    const [serverResponse, setServerResponse] = useState('');

    // Функция для обновления состояния
    const handleChange = (e) => {
        console.log('ldkow');
        const { id, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [id]: value }));
    };

    // Функция отправки данных
    const onSubmit = async (data) => {
        const body = {
            username: data.login,
            email: data.email,
            company: data.company,
            password: data.password,
        };

        try {
            const response = await axios.post('/api/auth/signup', body, {
                headers: { 'Content-Type': 'application/json' },
            });
            setServerResponse(response.data.message);
            console.log(response.data);
            login(response.data);
            navigate('/'); // Навигация после успешной регистрации
        } catch (err) {
            console.error('Error:', err);
        }
    };

    console.log('sigup');
    return (
        <div className="flex items-center justify-center">
            <div className="mt-4 max-w-xl w-full bg-[#222224] p-8 shadow-[0px_0px_1px_0px_rgba(255,255,255)] rounded-lg">
                <h1 className="text-3xl text-white font-base text-center mb-6">
                    Регистрация
                </h1>
                {serverResponse && (
                    <p className="text-green-500 text-sm text-center mt-4">
                        {serverResponse}
                    </p>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        id="login"
                        label="Логин"
                        type="text"
                        register={register}
                        errors={errors}
                        validation={{
                            required: 'Логин обязателен',
                            maxLength: {
                                value: 25,
                                message:
                                    'Логин не может быть длиннее 25 символов',
                            },
                            minLength: {
                                value: 4,
                                message:
                                    'Логин не может быть короче 4 символов',
                            },
                        }}
                        value={formData.login}
                        onChange={handleChange}
                        labelTextColor="gray-300"
                    />
                    <InputField
                        id="email"
                        label="Email"
                        type="email"
                        register={register}
                        errors={errors}
                        validation={{
                            required: 'Email обязателен',
                            maxLength: {
                                value: 80,
                                message:
                                    'Email не может быть длиннее 80 символов',
                            },
                        }}
                        value={formData.email}
                        onChange={handleChange}
                        labelTextColor="gray-300"
                    />
                    <InputField
                        id="company"
                        label="Название компании"
                        type="text"
                        register={register}
                        errors={errors}
                        validation={{
                            required: 'Company обязателен',
                            maxLength: {
                                value: 80,
                                message:
                                    'Company не может быть длиннее 80 символов',
                            },
                        }}
                        value={formData.company}
                        onChange={handleChange}
                        labelTextColor="gray-300"
                    />
                    <InputField
                        id="password"
                        label="Пароль"
                        type="password"
                        register={register}
                        errors={errors}
                        validation={{
                            required: 'Пароль обязателен',
                            minLength: {
                                value: 8,
                                message:
                                    'Пароль не может быть короче 8 символов',
                            },
                        }}
                        value={formData.password}
                        onChange={handleChange}
                        labelTextColor="gray-300"
                    />
                    <InputField
                        id="confirmPassword"
                        label="Повторите пароль"
                        type="password"
                        register={register}
                        errors={errors}
                        validation={{
                            required: 'Подтверждение пароля обязательно',
                            validate: {
                                matchesPasswords: (value) =>
                                    value !== formData.password ||
                                    'Пароли не совпадают',
                            },
                        }}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        labelTextColor="gray-300"
                    />
                    <button
                        type="submit"
                        className="mt-2 w-full p-2 bg-orange-500 text-white rounded-md hover:bg-red-600"
                    >
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
