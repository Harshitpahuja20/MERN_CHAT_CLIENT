import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { BiSolidSend } from "react-icons/bi";
import { useParams } from "react-router-dom";
import {FaFaceSmile} from "react-icons/fa6"
import Picker from "emoji-picker-react"

const ChatInfoFooter = ({ propsData }) => {
  const { setmsg, msgs, socket, isSocketConnected, typing,isTyping, setTyping , roomiId , currrentuser , typinguser , setTypingUser} =
    propsData;
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
  const { userid } = useParams();
  const token = localStorage.getItem("chat-token");
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false)

  const sendmessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing")
      setNewMessage("");
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/sendmessage`,
        headers: {
          "Content-Type": "application/json",
          "bearer-token": token,
        },
        data: {
          conversationID: userid,
          message: newMessage,
        },
      })
        .then((res) => {
          socket.emit("new message", res.data.Data);
          setmsg([...msgs, res.data.Data]);
          console.log(msgs);
        })
        .catch((err) => {
          Toast(err?.message);
          console.log("err in login" + err?.message);
        });
    }
  };
  const typingmessage = (e) => {
    setNewMessage(e.target.value);
    setTypingUser(currrentuser)
    if (!isSocketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing' , roomiId)
    }

    let lastTyping = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTyping;
      if(timeDiff >= timerLength){
        socket.emit("stop typing" , roomiId)
        setTyping(false)
        setTypingUser("")
      }
    }, timerLength);
  };

  function onClick(emojiData, event) {
    setNewMessage(
      (inputValue) =>
        inputValue + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
  }


  return (
    <>
    {isTyping && typinguser !== currrentuser ? <div>Loading...</div> : ""}
    {showEmoji && <Box className="emoji"><Picker onEmojiClick={onClick}/></Box>}
    
    <Flex
      background="gray.800"
      align="center"
      p=".5rem 1rem"
      gap="1rem"
      borderTop=".1px solid gray"
      pos="fixed"
      w={"-webkit-fill-available"}
      bottom={0}
      h="70px"
    >

<Box ms={"auto"} w="fit-content" className="smile" ><FaFaceSmile size="24px" color="white" cursor="pointer" onClick={()=>setShowEmoji(!showEmoji)}/></Box>
      <Flex
        w="90%"
        boxShadow="1px 1px 4px 2px #0000005e"
        me="auto"
        align="center"
        borderRadius={8}
      >
        
        <FormControl onKeyDown={sendmessage}>
          <Input
            focusBorderColor="transparent"
            value={newMessage}
            border="none"
            style={{ caretColor: "white" }}
            color="white"
            onChange={typingmessage}
          />
        </FormControl>
        <Button bg="transparent" colorScheme="transparent" p={0} onClick={sendmessage}>
          <BiSolidSend color="white" />
        </Button>
      </Flex>
    </Flex>
    </>
  );
};

export default ChatInfoFooter;
