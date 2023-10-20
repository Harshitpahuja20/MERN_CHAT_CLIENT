import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

const VideoCall = () => {
  const cameraPreview = useRef();

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("stream", stream);

      if (cameraPreview.current) {
        // Check if cameraPreview.current is not null
        cameraPreview.current.srcObject = stream;

        if (!cameraPreview.current.srcObject === stream) {
          openCamera();
        }
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  }

  const turncamoff = async () => {
    await navigator.mediaDevices.getUserMedia({ video: false });
    cameraPreview.current.srcObject = null;
  }

  useEffect(() => {
    openCamera();

    return () => {
      if (cameraPreview.current) {
        // Check if cameraPreview.current is not null before setting srcObject to null
        turncamoff()
      }
    };
  }, []);

  return (
    <Box pos="absolute" width="100%" height="100vh" top={0} left={0} bg={"black"}>
      <video ref={cameraPreview} style={{ width: "100vw", height: "100vh", zIndex: "100" }} autoPlay id="vid"></video>
    </Box>
  );
};

export default VideoCall;
