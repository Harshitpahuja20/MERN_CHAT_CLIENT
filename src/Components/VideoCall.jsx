import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { MdCallEnd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const VideoCall = () => {
  const cameraPreview = useRef();
  const streamRef = useRef(null); // Keep a reference to the stream.
  const [isResponsed, setIsResponsed] = useState();
  const naviagte = useNavigate();

  const darkStyle = {
    filter: "brightness(40%)",
  };

  const endCall = () => {
    turncamoff();
    naviagte(-1)
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; // Store the stream reference.
      console.log(stream);

      if (cameraPreview.current) {
        cameraPreview.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const turncamoff = async() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      if (cameraPreview.current) {
        cameraPreview.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    openCamera();

    return () => {
      turncamoff();
    };
  }, []);

  return (
    <>
      <Box
        pos="absolute"
        width="100%"
        height="100vh"
        top={0}
        left={0}
        bg={"black"}
      >
        <Box style={!isResponsed && darkStyle}>
          <video
            ref={cameraPreview}
            style={{
              width: "100vw",
              height: "100vh",
              zIndex: "100",
              objectFit: "contain",
            }}
            autoPlay
            id="vid"
          ></video>
        </Box>
        <Box
          pos="absolute"
          left={0}
          bottom={"8%"}
          width="100%"
          display={"flex"}
          justifyContent="center"
        >
          <Button
            bg="red.500"
            colorScheme="red.500"
            px="2rem"
            onClick={endCall}
          >
            <MdCallEnd color="white" fontSize="22px" title="End Call" />
          </Button>
        </Box>
      </Box>
      <Box
        pos={"absolute"}
        top={"45%"}
        left={"50%"}
        transform={"translate(-50% , -50%)"}
        display={"flex"}
        justifyContent={"center"}
        flexDir="column"
        gap={3}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="gray.500"
          size="xl"
          mx="auto"
        />
        <Text fontSize={"25px"} color="white">
          Please wait while connecting...
        </Text>
      </Box>
    </>
  );
};

export default VideoCall;
