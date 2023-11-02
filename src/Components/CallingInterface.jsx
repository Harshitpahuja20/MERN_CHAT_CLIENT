import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/ContextProvider";
import { Box, Button, Img, Spinner, Text } from "@chakra-ui/react";
import Profile from "../Assets/Images/profile.jpg";
import { MdCallEnd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import socket from "../socket/Socket";

const CallingInterface = () => {
  const { caller, isUrl, selectedChat } = useContext(MyContext);
  const [stream, setStream] = useState();
  const navigate = useNavigate();

  const openCamera = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          console.log(stream)
          setStream(stream);
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });
          const userIdtoCall = selectedChat?._id;
    
          peer.on("signal", (data) => {
            console.log(data);
            const callRequest = { ...caller, signal: data };
            socket.emit("call-request", { userIdtoCall, callRequest });
          });
        })
        .catch((err) => console.log(err));

      // if (cameraPreview.current) {
      //   cameraPreview.current.srcObject = stream;
      // }
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  useEffect(() => {
    if (caller === null) navigate("/");
    openCamera()
  }, []);

  return (
    <Box
      pos="absolute"
      width="100%"
      height="100vh"
      top={0}
      left={0}
      bg={"gray.800"}
      display={"flex"}
      justifyContent="center"
      alignItems={"center"}
      flexDirection={"column"}
      gap={"1rem"}
    >
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems="center"
        flexDir="column"
        gap="2rem"
      >
        <Box
          w={"200px"}
          height={"200px"}
          borderRadius={"50%"}
          overflow={"hidden"}
          border={"5px solid"}
          borderColor={"gray.600"}
        >
          <Img
            src={
              caller?.profile
                ? !isUrl(caller.profile)
                  ? process.env.REACT_APP_SERVER_URL + "/" + caller?.profile
                  : caller?.profile
                : Profile
            }
            w="100%"
            h="100%"
          />
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          flexDir="column"
          gap={3}
          position={"relative"}
        >
          <Text fontSize={"25px"} color="white" textAlign={"center"}>
            Calling {caller?.caller} . . .
          </Text>
          <Text fontSize={"25px"} color="white" textAlign={"center"}>
            Please Wait While Connecting . . .
          </Text>
        </Box>
      </Box>
      <Box
        //   pos="absolute"
        //   left={0}
        //   bottom={"8%"}
        width="100%"
        display={"flex"}
        justifyContent="center"
      >
        <Button
          bg="red.500"
          colorScheme="red.500"
          px="2rem"
          // onClick={endCall}
        >
          <MdCallEnd color="white" fontSize="22px" title="End Call" />
        </Button>
      </Box>
    </Box>
  );
};

export default CallingInterface;
