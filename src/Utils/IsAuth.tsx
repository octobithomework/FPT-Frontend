import { jwtDecode } from 'jwt-decode';

export const isAuth = (): boolean => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded: { exp: number } = jwtDecode(token);
            return decoded.exp > Date.now() / 1000;
        } catch (error) {
            console.error("Token decoding error:", error);
            return false;
        }
    }
    return false;
};