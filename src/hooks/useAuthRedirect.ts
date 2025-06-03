import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = ({
    requireAuth = false,
    redirectTo = '/login',
    redirectIfAuthenticated = false,
}: {
    requireAuth?: boolean;
    redirectTo?: string;
    redirectIfAuthenticated?: boolean;
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userId');

        if (requireAuth && !token) {
            navigate(redirectTo);
        }

        if (redirectIfAuthenticated && token) {
           navigate('/');
        }
    }, []);
};