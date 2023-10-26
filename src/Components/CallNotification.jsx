import { Box, Button, Img, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { MyContext } from "../context/ContextProvider";
import profile from "../Assets/Images/profile.jpg"
import socket from "../socket/Socket"

function CallNotification() {
  const {incomingCaller , setisIncomingCall , isUrl} = useContext(MyContext)

const deniendCall = () => {
  setisIncomingCall(false)
  socket.emit("call-disconnect" , incomingCaller?.id)
}

  return (
      <Modal isOpen={true}>
        <ModalOverlay />
        <ModalContent bg={"gray.700"} color={"white"}>
          <ModalHeader textAlign={"center"}>Incoming Video Call</ModalHeader>
          <ModalBody display="flex" flexDir="column" alignItems="center" gap={3}>
            <Box borderRadius={"100px"} w="fit-content" h="fit-content" overflow="hidden"><Img src={incomingCaller?.profile ? !isUrl(incomingCaller.profile) ? process.env.REACT_APP_SERVER_URL + "/" + incomingCaller?.profile : incomingCaller?.profile : profile} width="100%" objectFit={"contain"} maxH="150px" /></Box>
            <Text fontSize="20px">{incomingCaller?.caller}</Text>
          </ModalBody>
          <ModalFooter display={"flex"} justifyContent={"center"} gap={5}>
            <Button bg="red.500" colorScheme="red.500" mr={3} onClick={deniendCall}>
              Denied
            </Button>
            <Button bg={"green.600"} colorScheme="green.600" >Accept</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}

export default CallNotification


