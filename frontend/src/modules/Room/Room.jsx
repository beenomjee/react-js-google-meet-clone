import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSocket, useSpeechRecognition } from '../../hooks'
import { IconButton, Loader, Modal } from '../../components';
import { toast } from 'react-toastify';
import styles from './Room.module.scss';
import { useNavigate } from 'react-router-dom';

const Room = () => {
    useEffect(() => {
        console.log('RENDERING ROOM');
    }, [])

    const [presenterId, setPresenterId] = useState('');
    const [data, setData] = useState({
        isBoardOpen: false,
        isScreenSharing: false,
        isVideoTurnOn: true,
        isAudioTurnOn: true,
        isCaptionOn: false
    });
    const [connections, setConnections] = useState({});
    const [senders, setSenders] = useState([]);
    const [mySocketId, setMySocketId] = useState(null);
    let [socket, localStream] = useSocket(null);
    // speech recognition
    useSpeechRecognition(socket);

    const onButtonClick = e => {
        const id = e.target.id;
        let isUpdateRequire = false;
        // when board button is clicked
        if (id === 'isBoardOpen') {
            // when board is already sharing
            if (data.isBoardOpen) {
                socket.emit('user:board:sharing:stop', {});
                isUpdateRequire = true;
            }
            // when board is not already sharing
            else {
                // when screen is already sharing
                if (data.isScreenSharing) {
                    toast.error('Please turn off screen sharing to start board sharing!')
                    return;
                }
                // when other user sharing screen or board
                else if (presenterId) {
                    toast.error('Someone already sharing the board or screen!');
                    return;
                }
                // when all things are good, and turning on board sharing
                socket.emit('user:board:sharing', {});
                isUpdateRequire = true;
            }
        }
        // when scren button is clicked
        else if (id === 'isScreenSharing') {
            // when screen is already sharing
            if (data.isScreenSharing) {
                socket.emit('user:screen:sharing:stop', {});
                isUpdateRequire = true;
            }
            // when screen is not already sharing
            else {
                // when board is already sharing
                if (data.isBoardOpen) {
                    toast.error('Please turn off board sharing to start screen sharing!')
                    return;
                }
                // when other user sharing screen or board
                else if (presenterId) {
                    toast.error('Someone already sharing the board or screen!');
                    return;
                }
                // when all things are good, and turning on screen sharing
                socket.emit('user:screen:sharing', {});
                isUpdateRequire = true;
            }
        }
        // when video button is clicked
        else if (id === 'isVideoTurnOn') {
            // when video is already on 
            if (data.isVideoTurnOn) {
                socket.emit('user:video:TurnOff', {});
            }
            // when video is not already on 
            else {
                socket.emit('user:video:TurnOn', {});
            }
            isUpdateRequire = true;
        }
        // when audio button is clicked
        else if (id === 'isAudioTurnOn') {
            // when audio is already on 
            if (data.isAudioTurnOn) {
                socket.emit('user:audio:TurnOff', {});
            }
            // when audio is not already on 
            else {
                socket.emit('user:audio:TurnOn', {});
            }
            isUpdateRequire = true;
        }
        // when caption button is clicked
        else if (id === 'isCaptionOn') {
            // when caption is already on
            if (data.isCaptionOn) {
                socket.emit('user:caption:TurnOff', {});
            }
            // when caption is not already on 
            else {
                socket.emit('user:caption:TurnOn', {});
            }
            isUpdateRequire = true;
        }
        // when end button is clicked
        else if (id === 'end') {
            socket.emit('user:room:leave', {});
        }

        // udpating ui
        if (isUpdateRequire)
            setData(p => ({ ...p, [id]: !p[id] }));
    }

    const onUserJoin = useCallback(({ roomData, socketId }) => {
        setMySocketId(socketId);
        console.log('here add offer function!');
    }, [])

    const onBoardSharing = useCallback(({ user }) => {
        setPresenterId(user.socketId);
        // setting Screen video element
        // const videoEl = document.current.querySelector(`#video${user.socketId}`)
        // const screenShareVideoEl = document.querySelector('#screenShareVideo');
        // if (!videoEl || !screenShareVideoEl) return;
        // screenShareVideoEl.srcObject = videoEl.srcObject;

        if (mySocketId === user.socketId) {
            setData(p => ({ ...p, isBoardOpen: true }));
            toast.success('Your board has been shared!');
            // share my screen here
        } else
            toast.info(`${user.name} started board sharing!`)
    }, [mySocketId]);

    const onBoardSharingStop = useCallback(({ user }) => {
        setPresenterId('');
        if (user.socketId === mySocketId) {
            setData(p => ({ ...p, isBoardOpen: false }));
            toast.success("Board sharing stopped successfully!");
        }
        else
            toast.info(`${user.name} stopped board sharing!`);

    }, [mySocketId])

    const onScreenSharing = useCallback(({ user }) => {
        setPresenterId(user.socketId);
        // setting Screen video element
        // const videoEl = document.querySelector(`#video${user.socketId}`)
        // const screenShareVideoEl = document.querySelector('#screenShareVideo');
        // if (!videoEl || !screenShareVideoEl) return;
        // screenShareVideoEl.srcObject = videoEl.srcObject;

        if (mySocketId === user.socketId) {
            setData(p => ({ ...p, isScreenSharing: true }));
            toast.success('Your screen has been shared!');
            // share my screen here
        } else
            toast.info(`${user.name} started screen sharing!`)
    }, [mySocketId]);

    const onScreenSharingStop = useCallback(({ user }) => {
        setPresenterId('');
        if (user.socketId === mySocketId) {
            setData(p => ({ ...p, isScreenSharing: false }));
            toast.success("Screen sharing stopped successfully!");
        }
        else
            toast.info(`${user.name} stopped screen sharing!`);
    }, [mySocketId])

    const onVideoTurnOn = useCallback(({ user }) => {
        console.log('update ui here');
        if (user.socketId === mySocketId)
            toast.success("Camera turn on successfully!");
        else
            toast.info(`${user.name} turn on video camera!`);
    }, [mySocketId]);

    const onVideoTurnOff = useCallback(({ user }) => {
        console.log('update ui here');
        if (user.socketId === mySocketId)
            toast.success("Camera turn off successfully!");
        else
            toast.info(`${user.name} turn off video camera!`);
    }, [mySocketId]);

    const onAudioTurnOn = useCallback(({ user }) => {
        console.log('update ui here');
        if (user.socketId === mySocketId)
            toast.success("Microphone turn on successfully!");
        else
            toast.info(`${user.name} turn on his microphone!`);
    }, [mySocketId]);

    const onAudioTurnOff = useCallback(({ user }) => {
        console.log('update ui here');
        if (user.socketId === mySocketId)
            toast.success("Microphone turn off successfully!");
        else
            toast.info(`${user.name} turn off his microphone!`);
    }, [mySocketId]);

    const onTranscript = useCallback(({ user, transcript }) => {
        if (!data.isCaptionOn) return;
        let name = user.name;
        if (user.socketId === mySocketId) {
            name = 'You';
        }
        const html = `<p className=${styles.top}>${name}</p>
            <div className="bottom">
                <img src="${user.file ?? process.env.PUBLIC_URL + '/img/avatar.png'}" alt="${user.name}" />
                <p>${transcript}</p>
            </div>`
        const div1 = document.querySelector("#divCaption > div:nth-child(1)");
        const div2 = document.querySelector("#divCaption > div:nth-child(2)");
        div1.innerHTML = div2.innerHTML;
        div2.innerHTML = html;
    }, [data.isCaptionOn, mySocketId]);

    const onRoomLeave = useCallback(({ user }) => {
        toast.info(`${user.name} leaved room!`);
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('user:join', onUserJoin);
        socket.on('user:board:sharing', onBoardSharing);
        socket.on('user:board:sharing:stop', onBoardSharingStop);
        socket.on('user:screen:sharing', onScreenSharing);
        socket.on('user:screen:sharing:stop', onScreenSharingStop);
        socket.on('user:video:TurnOn', onVideoTurnOn);
        socket.on('user:video:TurnOff', onVideoTurnOff);
        socket.on('user:audio:TurnOn', onAudioTurnOn);
        socket.on('user:audio:TurnOff', onAudioTurnOff);
        socket.on('user:transcript', onTranscript);
        socket.on('user:room:leave', onRoomLeave);

        return () => {
            socket.off('user:join', onUserJoin);
            socket.off('user:board:sharing', onBoardSharing);
            socket.off('user:board:sharing:stop', onBoardSharingStop);
            socket.off('user:screen:sharing', onScreenSharing);
            socket.off('user:screen:sharing:stop', onScreenSharingStop);
            socket.off('user:video:TurnOn', onVideoTurnOn);
            socket.off('user:video:TurnOff', onVideoTurnOff);
            socket.off('user:audio:TurnOn', onAudioTurnOn);
            socket.off('user:audio:TurnOff', onAudioTurnOff);
            socket.off('user:transcript', onTranscript);
            socket.off('user:room:leave', onRoomLeave);

        }
    }, [socket, onUserJoin, onTranscript, onBoardSharing, onBoardSharingStop, onScreenSharing, onScreenSharingStop, onVideoTurnOn, onVideoTurnOff, onAudioTurnOn, onAudioTurnOff, onRoomLeave])

    // starting local stream
    useEffect(() => {
        let videoEl;
        if (mySocketId)
            videoEl = document.getElementById(`video${mySocketId}`)
        else
            videoEl = document.getElementById(`myVideo`)
        if (localStream && videoEl) {
            videoEl.srcObject = localStream;
        }
    }, [localStream, mySocketId])

    return (
        !socket ? <Loader /> :
            <div className="container">
                <div className="top">
                    <div className="screenShare">
                        <video autoPlay playsInline id='screenShareVideo' muted></video>
                    </div>
                    <div id='videoContainer' className="videoContainer">
                        <div id={mySocketId ? `div${mySocketId}` : ''}>
                            <video muted autoPlay playsInline id={mySocketId ? `video${mySocketId}` : 'myVideo'}></video>
                        </div>
                    </div>
                    <div id='divCaption' className="divCaption">
                        <div></div>
                        <div>
                            {/* <p className="top">Muneeb</p>
                        <div className="bottom">
                            <img alt='AVATAR' />
                            <p>message</p>
                        </div> */}
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="left"></div>
                    <div className="center">
                        <IconButton onClick={onButtonClick} id="isVideoTurnOn">{data.isVideoTurnOn ? 'cam on' : 'cam off'}</IconButton>
                        <IconButton onClick={onButtonClick} id="isAudioTurnOn">{data.isAudioTurnOn ? 'mic on' : 'mic off'}</IconButton>
                        <IconButton onClick={onButtonClick} id="isScreenSharing">{data.isScreenSharing ? 'scr on' : 'scr off'}</IconButton>
                        <IconButton onClick={onButtonClick} id="isBoardOpen">{data.isBoardOpen ? 'boa on' : 'boa off'}</IconButton>
                        <IconButton onClick={onButtonClick} id="isCaptionOn">{data.isCaptionOn ? 'cap on' : 'cap off'}</IconButton>
                        <IconButton onClick={onButtonClick} id="end">end</IconButton>
                    </div>
                    <div className="right"></div>
                </div>
            </div>
    )
}

export default Room