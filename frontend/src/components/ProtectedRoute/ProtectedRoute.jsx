import React, { useEffect, useState } from 'react'
// import styles from './ProtectedRoute.module.scss';
import { Loader } from '../';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { room } = useSelector(store => store.user);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        if (!room)
            navigate('/');
        setIsLoading(false);
    }, [room, navigate]);

    return (
        isLoading ? <Loader /> : <Element />
    )
}

export default ProtectedRoute;