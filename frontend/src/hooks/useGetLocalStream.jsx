import { useEffect, useState } from 'react'
import { getLocalStream } from '../utils';

const useGetLocalStream = (initialValue) => {
    const [localStream, setLocalStream] = useState(initialValue);

    useEffect(() => {
        const getStream = async () => {
            const stream = await getLocalStream();
            console.log('Starting local stream!');
            setLocalStream(stream);
        };

        getStream();
    }, [])

    return [localStream, setLocalStream];
}

export default useGetLocalStream