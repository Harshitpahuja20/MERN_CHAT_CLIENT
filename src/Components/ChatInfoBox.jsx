import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import ChatInfoNavbar from "./ChatInfoNavbar";
import ChatInfoFooter from "./ChatInfoFooter";
import MessageBox from "./MessageBox";

const ChatInfoBox = () => {
  let data = [
    {msg : "hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?hey , how are you ?" , type : "user1"},
    {msg : "hey , how are you ? hey , how are you ?" , type : "user2" , dir : "row-reverse"},
    {msg : "hey , how are you ?" , type : "user1"},
    {msg : "hey , how are you ?" , dir : "row-reverse" , type : "user2"},
    {msg : "hey , how are you ?" , type : "user1"},
    {msg : "hey , how are you ?" , dir : "row-reverse" , type : "user2"},
    {msg : "hey , how are you ?" , type : "user1"},
    {msg : "hey , how are you ?" , dir : "row-reverse" , type : "user2"},
  ]
  return (
    <Box maxW="100%">
      <ChatInfoNavbar />
      <Flex color="white" pt="62px" pb="75px" px="1rem" h="100vh" flexDir="column" gap="1rem" overflow="scroll">
       {data.map((data)=>{
        return <MessageBox msg={data.msg} dir={data.type === "user2" && data.dir} ms={data.type === "user2" && "auto"} me={!data.type === "user2" && "auto"}/>
       })}
      </Flex>
      <ChatInfoFooter />
    </Box>
  );
};

export default ChatInfoBox;
