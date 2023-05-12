import { useCallback, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition as useSpeechRecognitionLib } from 'react-speech-recognition';

const useSpeechRecognition = (socket) => {
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognitionLib({ clearTranscriptOnListen: true, });

    const startListening = useCallback(async () => {
        if (socket && browserSupportsSpeechRecognition) {
            await SpeechRecognition.startListening({ language: 'en-IN', continuous: true, interimResults: false });
            console.log('listening!');
        } else if (!browserSupportsSpeechRecognition) {
            console.log('Browser not support this feature!');
            socket.emit("user:speech:notAvailable", {});
        }
    }, [browserSupportsSpeechRecognition, socket])

    useEffect(() => {
        startListening();

        return async () => {
            if (socket && browserSupportsSpeechRecognition) {
                await SpeechRecognition.stopListening();
                console.log("Speech recognition has stopped.");
            }
        }
    }, [startListening, socket, browserSupportsSpeechRecognition])

    useEffect(() => {
        if (transcript && socket) {
            console.log(transcript);
            socket.emit("user:transcript", { transcript });
        }
    }, [socket, transcript]);
}

export default useSpeechRecognition