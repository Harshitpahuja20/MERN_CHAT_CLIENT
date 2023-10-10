import { Box, Flex, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import ChatInfoNavbar from "./ChatInfoNavbar";
import ChatInfoFooter from "./ChatInfoFooter";
import MessageBox from "./MessageBox";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScrollableFeed from "react-scrollable-feed";
import { MyContext } from "../context/ContextProvider";

const ChatInfoBox = () => {
  const chatContainerRef = useRef(null);
  const token = localStorage.getItem("chat-token");
  const { userData } = useContext(MyContext);
  console.log(token);
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
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/findchat/${chatID}/${user2ID}`,
      headers: {
        "Content-Type": "application/json",
        "bearer-token": token,
      },
    })
      .then((res) => {
        console.log(res?.data?.Data);
        setMessages(res?.data?.Data?.chat);
      })
      .catch((err) => {
        Toast("Failed to fetch messages");
        console.log("err in login" + err?.message);
      });
  };

  useEffect(() => {
    fetchmessages(userid, user2id);
  }, [user2id, userid]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box maxW="100%">
      <ChatInfoNavbar />
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
      <ChatInfoFooter setmsg={setMessages} msgs={messages} />
    </Box>
  );
};

export default ChatInfoBox;
