import { Box, Flex, Img, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Profile from "../Assets/Images/profile.jpg";
import { MyContext } from "../context/ContextProvider";

const ChatBox = ({ data, bg }) => {
  const { isUrl, setSelectedChat } = useContext(MyContext);
  const setchatdetails = () => {
    setSelectedChat(data?.reciever);
  };
  return (
    <Link
      to={`/user/` + data?._id + "/" + data?.reciever?._id}
      style={{ width: "100%" }}
      onClick={setchatdetails}
    >
      <Flex
        w="100%"
        h="100%"
        maxH="72px"
        minH="72px"
        gap="1rem"
        overflow="hidden"
        color="whiteAlpha.700"
        bg={bg || "gray.800"}
        align="center"
      >
        <Box
          w="100%"
          maxW="50px"
          h="50px"
          borderRadius="100%"
          ml="1rem"
        >
          <Img
            src={
              data?.reciever?.profile
                ? !isUrl(data.reciever?.profile)
                  ? process.env.REACT_APP_SERVER_URL +
                    "/" +
                    data?.reciever?.profile
                  : data?.reciever?.profile
                : Profile
            }
            w="100%"
            h="100%"
            objectFit="cover"
            borderRadius={"25px"}
          />
        </Box>
        <Flex
          p=".5rem 0rem"
          flexDir="column"
          borderBottom="1px"
          borderColor="whiteAlpha.300"
          w="100%"
        >
          <Text>{data?.reciever?.email}</Text>
          <Text fontSize="smaller">{data?.lastmessage || "No Message Yet"}</Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export default ChatBox;
