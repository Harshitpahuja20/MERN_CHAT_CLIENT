import { useEffect, useState } from "react";
import { MyContext } from "./ContextProvider";
import jwtDecode from 'jwt-decode';
import {useToast } from "@chakra-ui/react";
import axios from "axios";

const ContextValue = ({ children }) => {
  let token;
  const [userData, setUserData] = useState({});
  const [totalChats, setTotalChats] = useState();
  const [selectedChat , setSelectedChat] = useState({})
  const [isIncomingCall, setisIncomingCall] = useState(false)
  const [incomingCaller, setIncomingCaller] = useState(null)
  const [streamm , setStreamm] = useState()
  const [isScoketConnected , setIsSocketConnected] = useState(false)
  const [caller , setCaller] = useState(null)
  const [loader, setLoader] = useState(false);
  const toast = useToast();
  function Toast(title , status){
    return toast({
      description: title,
      status: status || 'error',
      duration: 3500,
      isClosable: true,
      position : "top-right"
    })
  }
  function isUrl(str) {
    const urlRegex = /^(http(s)?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return urlRegex.test(str);
  }
  function logout() {
    const token = localStorage.getItem('chat-token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp < Date.now() / 1000;
  
        if (isTokenExpired) {
          localStorage.removeItem('chat-token');
         window.location.replace("/")
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
    }
  }
 async function getbasicdata(token){
  setLoader(true)
    await axios({
      method : "POST",
      url : `${process.env.REACT_APP_SERVER_URL}/getloginuserdetails`,
      headers : {
          "Content-Type" : "application/json",
          "bearer-token" : token
      },
   }).then((res)=>{
    setLoader(false)
    if(res?.data?.status){
      const user = res.data.Data.user
      localStorage.setItem("user-data" , JSON.stringify({
        email : user.email , profile : user.profile , username : user.username
      }))
     setUserData(res.data.Data.user)
     setTotalChats(res.data.Data.Conversations)
    }else{
      Toast(res?.data?.message)
    }
   }).catch((err)=>{
    Toast(err?.message)
    console.log("err in login" + err?.message)
   })
  }
  
  useEffect(()=>{
    token = localStorage.getItem("chat-token")
    logout()
   if(token){
    getbasicdata(token)
   }
  },[token])

  return (
    <MyContext.Provider value={{incomingCaller, setIncomingCaller , userData , isUrl , logout , totalChats , getbasicdata , selectedChat , setSelectedChat , isIncomingCall , setisIncomingCall , isScoketConnected , setIsSocketConnected , caller , setCaller , streamm , setStreamm , loader}}>
      {children}
    </MyContext.Provider>
  );
};

export default ContextValue;
