import React, { useEffect, useRef } from 'react'
import styles from './Modal.module.scss'
import { useClickOutside } from '../../hooks';

const Modal = ({ animationDuration = 100, closeHandler, className, open, children, style, ...props }) => {
    const menuRef = useRef(null);
    useClickOutside(menuRef, closeHandler);
    useEffect(() => {
        if (menuRef && open) {
            menuRef.current.click();
        }
    }, [menuRef, open]);
    return (
        <>
            {open && <div className={styles.modalBg}></div>}
            <div style={{
                '--modal-scale': open ? 1 : 0,
                '--modal-animation-duration': animationDuration,
                ...style
            }} {...props} ref={menuRef} className={`${styles.container} ${className} ${open ? styles.open : ''}`}>
                {children}
            </div>
        </>
    )
}

export default Modal;