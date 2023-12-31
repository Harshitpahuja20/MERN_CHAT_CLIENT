import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MdCallEnd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Peer from "simple-peer";
import { MyContext } from "../context/ContextProvider";
import socket from "../socket/Socket";

const VideoCall = () => {
  const cameraPreview = useRef();
  const streamRef = useRef(); // Keep a reference to the stream.
  const [isResponsed, setIsResponsed] = useState();
  const { userid } = useParams();
  const naviagte = useNavigate();
  const {
    caller,
    selectedChat,
    userData,
    incomingCaller,
    setisIncomingCall,
    streamm,
  } = useContext(MyContext);

  const darkStyle = {
    filter: "brightness(40%)",
  };

  const peer = new Peer({
    initiator: true,
    trickle: false,
  });

  const endCall = () => {
    turncamoff();
    naviagte(-1);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream; // Store the stream reference.
        })
        .catch((err) => console.log(err));

      if (cameraPreview.current) {
        cameraPreview.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const turncamoff = async () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      if (cameraPreview.current) {
        cameraPreview.current.srcObject = "";
      }
    }
  };

  useEffect(() => {
    if (!caller && !incomingCaller) naviagte("/");
    if (caller && caller !== null) {
      openCamera();
      const userIdtoCall = selectedChat?._id;

      peer.on("signal", (data) => {
        const callRequest = { ...caller, signal: data };
        socket.emit("call-request", { userIdtoCall, callRequest });
      });

      // peer.on("stream", (stream) => {

      // });
    } else {
      cameraPreview.current.srcObject = streamm;
    }

    return () => {
      turncamoff();
    };
  }, [streamm]);

  useEffect(() => {
    setisIncomingCall(false);
    socket.on("call-accepted", (data) => {
      openCamera();
      if (cameraPreview.current && streamm) {
        peer.signal(data);
        cameraPreview.current.srcObject = peer;
      } else {
        console.log("cameraPreview element is null");
      }
    });
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
