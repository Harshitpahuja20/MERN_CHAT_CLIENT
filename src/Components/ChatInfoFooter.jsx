import { Button, Flex, FormControl, Input, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import {BiSolidSend} from "react-icons/bi"
import { useParams } from "react-router-dom";

const ChatInfoFooter = ({setmsg , msgs}) => {
  const toast = useToast()
  function Toast(title , status){
    return toast({
      description: title,
      status: status || 'error',
      duration: 3500,
      isClosable: true,
      position : "top-right"
    })
  }
  const {userid} = useParams()
  const token = localStorage.getItem("chat-token")
  const [newMessage, setNewMessage] = useState("")

  const sendmessage = async(e) => {
    if(e.key === "Enter" && newMessage){
      setNewMessage("")
      await axios({
        method : "POST",
        url : `${process.env.REACT_APP_SERVER_URL}/sendmessage`,
        headers : {
            "Content-Type" : "application/json",
            "bearer-token" : token
        },
        data : {
          conversationID : userid,
          message : newMessage
        }
     }).then((res)=>{
       setmsg([...msgs , res.data.Data])
       console.log(msgs)
     }).catch((err)=>{
      Toast(err?.message)
      console.log("err in login" + err?.message)
     })
    }
  }
  const typingmessage = (e) => {
    setNewMessage(e.target.value)
  }

  return (
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
      <Flex w="90%" boxShadow="1px 1px 4px 2px #0000005e" mx="auto" align="center" borderRadius={8}>
        <FormControl onKeyDown={sendmessage}>
        <Input focusBorderColor="transparent" value={newMessage} border="none" style={{caretColor : "white"}} color="white" onChange={typingmessage}/>
        </FormControl>
        <Button bg="transparent" colorScheme="transparent" p={0}><BiSolidSend color="white"/></Button>
      </Flex>
    </Flex>
  );
};

export default ChatInfoFooter;
