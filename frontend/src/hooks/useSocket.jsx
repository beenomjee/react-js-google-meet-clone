import { useEffect, useState } from 'react'
import useGetLocalStream from './useGetLocalStream';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const useSocket = (initialValue) => {
    const [localStream] = useGetLocalStream(null);
    const [socket, setSocket] = useState(initialValue);
    const { name, email, file } = useSelector(store => store.user)
    const { room } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStream && !socket) {
            console.log('Start Scoket');
            const socket = io('http://localhost:3001');
            socket.emit("user:join", {
                user: {
                    isAudioTurnOn: true,
                    isVideoTurnOn: true,
                    isBoardSharing: false,
                    isScreenSharing: false,
                    isCaptionAvailable: true,
                    name,
                    email,
                    file,
                },
                room,
            });
            setSocket(socket);
        }

        return () => {
            if (localStream && socket) {
                console.log('Stoping Scoket and local Stream');
                socket && socket.close();
                for (const track of localStream.getTracks()) {
                    track.stop();
                }
                toast.success('Leave Room Successfully!');
                navigate('/');
            }
        }
    }, [localStream, socket, name, email, file, room, navigate]);

    return [socket, localStream];
}

export default useSocket