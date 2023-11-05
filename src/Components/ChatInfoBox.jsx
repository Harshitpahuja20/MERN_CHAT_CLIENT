import { Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import ChatInfoNavbar from "./ChatInfoNavbar";
import ChatInfoFooter from "./ChatInfoFooter";
import MessageBox from "./MessageBox";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../context/ContextProvider";
import { io } from "socket.io-client";
import common_socket from "../socket/Socket"

const ENDPOINT = "http://localhost:9999";
var selectedchatcompare;

const ChatInfoBox = () => {
  const chatContainerRef = useRef(null);
  const token = localStorage.getItem("chat-token");
  const { userData, selectedChat, setSelectedChat , getbasicdata} = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, SetIsTyping] = useState(false);
  const [typinguser, setTypingUser] = useState("");
  const toast = useToast();
  function Toast(title, status) {
    return toast({
      description: title,
      status: status || "error",
      duration: 3500,
      isClosable: true,
      position: "top-right",
    });
  }
  const [messages, setMessages] = useState([]);
  const { userid, user2id } = useParams();

  const fetchmessages = async (chatID, user2ID) => {
    setMessages([]);
    setIsLoading(true);
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/findchat/${chatID}/${user2ID}`,
      headers: {
        "Content-Type": "application/json",
        "bearer-token": token,
      },
    })
      .then((res) => {
        if (Object.keys(selectedChat).length === 0)
          setSelectedChat(res?.data?.Data?.reciever);
        setMessages(res?.data?.Data?.chat);
        setIsLoading(false);
        common_socket.emit("join chat", userid);
      })
      .catch((err) => {
        Toast("Failed to fetch messages");
        console.log("err in login" + err?.message);
      });
  };

  useEffect(() => {
    common_socket.on("typing", () => {
      SetIsTyping(true);
    });
    common_socket.on("stop typing", () => {
      SetIsTyping(false);
    });
  }, []);

  useEffect(() => {
    common_socket.on("message received", (newmessagereceived) => {
      //   if(!selectedchatcompare || selectedchatcompare !== newmessagereceived.chat._id){
      //     //
      //   }{
      setMessages([...messages, newmessagereceived]);
      getbasicdata(token)
      //   }
    });
  });

  useEffect(() => {
    fetchmessages(userid, user2id);
    selectedchatcompare = userid;
  }, [user2id, userid]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const propsData = {
    setmsg: setMessages,
    msgs: messages,
    socket: common_socket,
    typing : typing,
    isTyping : typing,
    setTyping : setTyping,
    setIsTyping : typing ,
    roomiId : userid , 
    isTyping : isTyping,
    setTypingUser : setTypingUser,
    typinguser : typinguser,
    currrentuser : userData?._id
  };

  return (
    <Box maxW="100%">
      <ChatInfoNavbar selectedChat={selectedChat} />
      {!isLoading ? (
        <Flex
          color="white"
          pt="70px"
          pb="80px"
          px="1rem"
          h="100vh"
          flexDir="column"
          gap="1rem"
          overflow="scroll"
          ref={chatContainerRef}
        >
          {messages?.map((data) => {
            return (
              <MessageBox
                msg={data.messagesent}
                dir={data.sender !== userData?._id && data.dir}
                issender={
                  data.sender?._id
                    ? data.sender._id === userData?._id
                    : data.sender === userData?._id
                }
              />
            );
          })}
        </Flex>
      ) : (
        <Flex
          color="white"
          pt="70px"
          pb="80px"
          px="1rem"
          h="100vh"
          flexDir="column"
          gap="1rem"
          overflow="scroll"
          ref={chatContainerRef}
          justify={"center"}
          align={"center"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      )}
      
      <ChatInfoFooter propsData={propsData} />
    </Box>
  );
};

export default ChatInfoBox;
