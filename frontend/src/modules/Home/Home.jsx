import React, { useRef, useState } from 'react'
import styles from './Home.module.scss';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store';
import { useDispatch } from 'react-redux';
import { IconButton } from '../../components';
import { IoIosMenu } from 'react-icons/io'
import { useClickOutside } from '../../hooks';

const Home = () => {
    const [room, setRoom] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/room/' + room);
    }

    useClickOutside(menuRef, () => {
        setIsMenuOpen(false);
    })
    return (
        <>
            <div ref={menuRef} className={styles.topMenu}>
                <IconButton onClick={e => setIsMenuOpen(p => !p)}><IoIosMenu /></IconButton>
                <div className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
                    <button onClick={e => dispatch(logoutUser())}>Logout</button>
                </div>
            </div>
            <div className={styles.center}>
                <form onSubmit={handleSubmit} action="#" className={styles.container}>
                    <input value={room} onChange={(e) => setRoom(e.target.value)} type="text" name="room" placeholder='Room Name' required />
                    <input type="submit" value="Enter" />
                </form>
            </div>
        </>
    )
}

export default Home