import { Box, Grid, GridItem, useToast } from "@chakra-ui/react";
import React, { useContext , useEffect} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AllChat from "../Components/AllChat";
import CallNotification from "../Components/CallNotification";
import { MyContext } from "../context/ContextProvider";
import socket from "../socket/Socket"

const MainComponent = () => {
  const toast = useToast();
  const navigate = useNavigate()
  function Toast(title , status){
    return toast({
      description: title,
      status: status || 'error',
      duration: 3500,
      isClosable: true,
      position : "top-right"
    })
  }
  
  const {setisIncomingCall , isIncomingCall , setIncomingCaller , userData , isScoketConnected , setIsSocketConnected , caller} = useContext(MyContext)

  useEffect(() => {
    socket.emit("setup", userData);
    socket.on("connected", () => {
      setIsSocketConnected(true);
    });
  
    if (isScoketConnected) {
      socket.on('incoming-call', ({ callRequest }) => {
        setIncomingCaller(callRequest)
        setisIncomingCall(true)
      });
  
      // Add the event listener for "call-disconnected"
      const handleCallDisconnected = () => {
        Toast("User has disconnected the call")
        navigate("/user/" + caller?.roomId + "/" + caller?.callerid)
      };
  
      socket.on("call-disconnected", handleCallDisconnected);
  
      // Clean up the event listener when the component unmounts
      return () => {
        socket.off("call-disconnected", handleCallDisconnected);
      };
    }
  });

  return (
    <>
     <Box h="100vh" maxW="100vw">
      <Grid
        templateAreas={`"nav main main"
                  "nav main main"`}
        gridTemplateColumns={"400px 1fr"}
        h="100vh"
        color="blackAlpha.700"
        fontWeight="bold"
        className="gridSystem">
        <GridItem area={"nav"} height={"100%"} bg="aliceblue" className="gridnav">
          <AllChat />
        </GridItem>
        <GridItem
          maxW="100%"
          bg="gray.900"
          area={"main"}
          className="gridmain"
          overflowX={"hidden"}
          overflowY={"scroll"}>
          <Outlet />
        </GridItem>
      </Grid> 
    </Box>

    {isIncomingCall && <CallNotification/>}
    </>
   
  );
};

export default MainComponent;
