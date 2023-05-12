import React, { useEffect } from 'react'
// import styles from './ProtectedRoute.module.scss';
import { Loader } from '../';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ element: Element }) => {
    const user = useSelector(store => store.user);
    const { room } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.name && !user.isLoading) {
            navigate('/signin');
        }
        else if (!room) {
            navigate('/');
        }
    }, [navigate, room, user.isLoading, user.name]);

    return (
        user.isLoading ? <Loader /> : <Element />
    )
}

export default ProtectedRoute;