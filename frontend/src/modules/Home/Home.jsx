import React, { useState } from 'react'
import styles from './Home.module.scss';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store';
import { useDispatch } from 'react-redux';

const Home = () => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setUser({ name, room }))
        navigate('/room');
    }
    return (
        <div className={styles.center}>
            <form onSubmit={handleSubmit} action="#" className={styles.container}>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder='Name' required />
                <input value={room} onChange={(e) => setRoom(e.target.value)} type="text" name="room" placeholder='Room Name' required />
                <input type="submit" value="Enter" />
            </form>
        </div>
    )
}

export default Home