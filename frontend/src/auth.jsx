import { createAsyncAuthProvider } from "react-token-auth";

// Убираем типизацию Session
export const { useAuth, authFetch, login, logout } = createAsyncAuthProvider({
    accessTokenKey: "access_token",
    accessTokenExpireKey: "exp",
    storage: localStorage,
    onUpdateToken: (token) =>
        fetch("/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.refresh_token}`,
            },
        })
            .then((r) => r.json())
            .then(console.log("refr"))
            .catch((err) => {
                console.error("Token Refresh error:", err);
            }),
});

// export const checkIfAdmin = async () => {
//     let accessToken = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
//     console.log(JSON.parse(accessToken));
//     try {
//         // Запрос на сервер для проверки роли пользователя
//         const response = await fetch("/auth/is_admin", {
//             method: "GET",
//             headers: {
//                 Authorization: `Bearer ${JSON.parse(accessToken)}`, // Передаем токен в заголовке
//             },
//         });

//         if (!response.ok) {
//             throw new Error(
//                 "Не удалось получить информацию о роли пользователя"
//             );
//         }

//         const data = await response.json();
//         console.log(data);
//         return data[0].message === true; // Если true, значит пользователь администратор
//     } catch (error) {
//         console.error("Ошибка при проверке роли:", error);
//         return false; // Если произошла ошибка, считаем, что это не администратор
//     }
// };
