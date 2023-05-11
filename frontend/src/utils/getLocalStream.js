const getLocalStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  return stream;
};

export default getLocalStream;
