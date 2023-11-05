import {
  Box,
  Button,
  Img,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/ContextProvider";
import profile from "../Assets/Images/profile.jpg";
import socket from "../socket/Socket";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";

function CallNotification() {
  const navigate = useNavigate();
  const { incomingCaller, setisIncomingCall, isUrl , setStreamm } = useContext(MyContext);
  const [ansStream, setAnsStream] = useState();
  const deniendCall = () => {
    setisIncomingCall(false);
    socket.emit("call-disconnect", incomingCaller?.id);
  };

  const answerCall = async () => {
    setisIncomingCall(false);
    navigate("/call/" + incomingCaller.roomId);
    await navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setAnsStream(stream);
      })
      .catch((err) => console.log(err));
  
    // Create a new Peer instance
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: ansStream,
    });
  
    // Handle signal
    peer.on("signal", (data) => {
      socket.emit("answer-call", {
        signal: data,
        to: incomingCaller?.callerid,
      });
    });
  
    // Handle potential peer destruction
    peer.on("close", () => {
      // Handle any cleanup or UI updates here if needed
    });
  
    // Handle incoming signal
    peer.signal(incomingCaller.signal);
    setStreamm(peer)
  };
  

  return (
    <Modal isOpen={true}>
      <ModalOverlay />
      <ModalContent bg={"gray.700"} color={"white"}>
        <ModalHeader textAlign={"center"}>Incoming Video Call</ModalHeader>
        <ModalBody display="flex" flexDir="column" alignItems="center" gap={3}>
          <Box
            borderRadius={"100px"}
            w="fit-content"
            h="fit-content"
            overflow="hidden"
          >
            <Img
              src={
                incomingCaller?.profile
                  ? !isUrl(incomingCaller.profile)
                    ? process.env.REACT_APP_SERVER_URL +
                      "/" +
                      incomingCaller?.profile
                    : incomingCaller?.profile
                  : profile
              }
              width="100%"
              objectFit={"contain"}
              maxH="150px"
            />
          </Box>
          <Text fontSize="20px">{incomingCaller?.caller}</Text>
        </ModalBody>
        <ModalFooter display={"flex"} justifyContent={"center"} gap={5}>
          <Button
            bg="red.500"
            colorScheme="red.500"
            mr={3}
            onClick={deniendCall}
          >
            Denied
          </Button>
          <Button bg={"green.600"} colorScheme="green.600" onClick={answerCall}>
            Accept
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CallNotification;
