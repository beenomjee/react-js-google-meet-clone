import { toast } from "react-toastify";

const getLocalStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: {
          max: 640,
          min: 256,
          ideal: 256,
        },
        height: {
          max: 480,
          min: 144,
          ideal: 144,
        },
        frameRate: 7,
      },
    });
    return stream;
  } catch (err) {
    console.log("Local stream error!");
    toast.error("Something went wrong. Please relaod page!");
    return null;
  }
};

export default getLocalStream;
