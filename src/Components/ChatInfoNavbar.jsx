import { Box, Button, Flex, Img, Text } from "@chakra-ui/react";
import Profile from "../Assets/Images/profile.jpg";
import {FaArrowLeftLong} from "react-icons/fa6"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../context/ContextProvider";
import {FaVideo} from 'react-icons/fa6'
import socket from "../socket/Socket"
import Peer from "simple-peer"

const ChatInfoNavbar = ({selectedChat}) => {
  const { isUrl , userData , isScoketConnected , setCaller} = useContext(MyContext);
  const navigate = useNavigate()
  const {userid} = useParams()

const videofunc = () => {
  setCaller({
    callerid : selectedChat._id,
    caller : selectedChat.username , 
    profile : selectedChat.profile,
    roomId : userid
  })
}

  return (
    <Flex pos="fixed" w={"-webkit-fill-available"} h="80px" flexDir="column">
    <Flex height="100%" background="gray.800" maxH="57px" align="center" p="0rem 1rem" gap="1rem" borderBottom=".1px solid gray" w={"-webkit-fill-available"} >
      <Button bg="transparent" colorScheme='transparent' px={0} minW="fit-content" onClick={()=>navigate('/')}><FaArrowLeftLong title="Go back"/></Button>
      <Box w="40px" h="40px" borderRadius="100%" overflow="hidden">
        <Img  src={selectedChat?.profile ? !isUrl(selectedChat.profile) ? process.env.REACT_APP_SERVER_URL + "/" + selectedChat?.profile : selectedChat?.profile : Profile} w="100%" h="100%" />
      </Box>
      <Text color="white" fontSize="xl">{selectedChat?.username}</Text>

      {/* <Box ms="auto" me={5}>
        {isScoketConnected && <Link to={"/call/" + userid} onClick={videofunc}><FaVideo size="20px" color="white" title="video call" /></Link>}
      </Box> */}

    </Flex>
   {selectedChat?.status &&<Box bg="#a8a8a842" p=".10rem">
      <Text textAlign="center" color="white" fontSize="11px" fontWeight="light">{selectedChat?.status}</Text>
    </Box> } 
    </Flex>
  )
}

export default ChatInfoNavbar