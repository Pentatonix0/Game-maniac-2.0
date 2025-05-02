import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth';
import InputField from '../components/InputField';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null); // Состояние для ошибки

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const loginUser = async (data) => {
        const body = {
            username: data.login,
            password: data.password,
        };

        try {
            const response = await axios.post('/api/auth/login', body, {
                headers: { 'Content-Type': 'application/json' },
            });
            login(response.data);
            navigate('/');
        } catch (error) {
            console.error('There was an error logging in:', error);
            setLoginError('Неверный логин или пароль');
        }

        reset();
    };

    return (
        <div className="flex items-center justify-center">
            <div className="mt-24 max-w-lg w-full bg-[#222224] p-8 shadow-[0px_0px_1px_0px_rgba(255,255,255)] rounded-lg">
                <h1 className="text-3xl text-white font-base text-center mb-6">
                    Вход в систему
                </h1>
                {loginError && (
                    <p className="text-red-500 text-sm text-center mt-4">
                        {loginError}
                    </p>
                )}
                <form onSubmit={handleSubmit(loginUser)}>
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
                        labelTextColor="gray-300"
                    />

                    <button
                        type="submit"
                        className="mt-6 w-full p-2 bg-[#FF5F00] text-white rounded-md hover:bg-red-600"
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
