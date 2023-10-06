import { Box, Button, Flex, Img, Text } from "@chakra-ui/react";
import Profile from "../Assets/Images/profile.jpg";
import {FaArrowLeftLong} from "react-icons/fa6"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../context/ContextProvider";

const ChatInfoNavbar = () => {
  const { isUrl } = useContext(MyContext);
  let userData;
  const navigate = useNavigate()
  return (
    <Flex background="gray.800" align="center" p="0rem 1rem" gap="1rem" borderBottom=".1px solid gray" pos="fixed" w={"-webkit-fill-available"} h="57px">
      <Button bg="transparent" colorScheme='transparent' px={0} minW="fit-content" onClick={()=>navigate('/')}><FaArrowLeftLong title="Go back"/></Button>
      <Box w="40px" h="40px" borderRadius="100%" overflow="hidden">
        <Img  src={userData?.profile ? !isUrl(userData.profile) ? process.env.REACT_APP_SERVER_URL + "/" + userData?.profile : userData?.profile : Profile} w="100%" h="100%" />
      </Box>
      <Text color="white" fontSize="xl">{"username"}</Text>
    </Flex>
  )
}

export default ChatInfoNavbar