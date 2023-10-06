import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import Chats from "./Chats";
import { Box, Button, Flex, IconButton, Img, Input, Text, useToast } from "@chakra-ui/react";
import {AiOutlineClose} from "react-icons/ai"
import {MdSpeakerNotesOff} from "react-icons/md"
import Profile from "../Assets/Images/profile.jpg";
import axios from "axios";
import { MyContext } from "../context/ContextProvider";

const AllChat = () => {
  const [isloading , setIsLoading] = useState(false)
  const  {isUrl}  = useContext(MyContext);
  const [data , setData] = useState([])
  const [isSearch , setIsSearch] = useState(false)
  const [isfrinedDrawer , setIsFrinedDrawer] = useState(false)
  const [searchValue , setSearchValue] = useState("")
  const searchon = () => {setIsSearch(true)}
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
  const searchfunc = async(e) => {
    setIsLoading(true)
    await axios({
      method : "POST",
      url : process.env.REACT_APP_SERVER_URL + "/searchauser/" + (e?.target?.value ? e?.target?.value : searchValue),
      headers : {
        "Content-Type" : "application/json",
        "bearer-token" : localStorage.getItem('chat-token')
      }
    }).then((res)=>{
      setIsLoading(false)
      console.log(res.data.Data)
      if(res.data.status){
        setData(res?.data?.Data)
      }else{
        setData([])
      }
    }).catch((err)=>{
      setData([])
      console.log(err.message)
    })
  }
  const searchvaluechange = async(e) => {
    setSearchValue(e.target.value);
    if(searchValue.length === 0){setData([]); setIsLoading(false); return}
    searchfunc(e)
  }
  const addfriend = async(id) => {
    await axios({
      method : "POST",
      url : process.env.REACT_APP_SERVER_URL + "/addfriend/" + id,
      headers : {
        "Content-Type" : "application/json",
        "bearer-token" : localStorage.getItem('chat-token')
      }
    }).then((res)=>{
      console.log(res.data)
      if(res?.data?.status){
        searchfunc()
        Toast(res.data.message , "success")
      }else{
        Toast(res.data.message)
      }
    }).catch((err)=>{
      Toast(err.message)
      console.log(err.message)
    })
  }
  const removefriend = async(id) => {
    await axios({
      method : "POST",
      url : process.env.REACT_APP_SERVER_URL + "/removefriend/" + id,
      headers : {
        "Content-Type" : "application/json",
        "bearer-token" : localStorage.getItem('chat-token')
      }
    }).then((res)=>{
      console.log(res.data)
      if(res?.data?.status){
        searchfunc()
        Toast(res.data.message , "success")
      }else{
        Toast(res.data.message)
      }
    }).catch((err)=>{
      Toast(err.message)
      console.log(err.message)
    })
  }
  const closeall = async()=>{setIsSearch(false);setIsFrinedDrawer(false);}

  return (
    <Flex flexDir="column" bg="blackAlpha.800" maxH="100vh" h="100vh" overflow="scroll" pos="relative">
      <Navbar isSearch={searchon} closeall={closeall}/>
      <Chats openfrinedDrawer={()=>setIsFrinedDrawer(true)} isfrinedDrawer={isfrinedDrawer} closefrienddrawer={()=>setIsFrinedDrawer(false)} isSearch={()=>setIsSearch(true)}/>
     {isSearch && <Box w="100%" h="100%" pos="absolute" bg="gray.800">
       <Flex h="100px" justify="center" flexDir='column' px="1rem" gap=".5rem" bg="gray.900" pos="sticky" top={0}>
        <Flex justify="space-between" align="center"><Text fontSize="xl" color="white">Add new friends</Text> <IconButton bg="transparent" colorScheme="transparent" fontSize="2xl" icon={<AiOutlineClose title="close" onClick={()=>{setIsSearch(false); setData([]); setSearchValue("")}} />}/> </Flex>
        <Input focusBorderColor="white" placeholder="Search user by gmail" color="white" value={searchValue} onChange={searchvaluechange}/>
       </Flex>
       <Flex maxH="100%" w="100%" overflowX="hidden" overflowY="scroll" flexDir="column" my=".5rem">
        {data.length === 0 ? <Flex align="center" gap="1" mt="50px" justify="center">{!isloading ?<> <Text fontSize="xl" color="whiteAlpha.800">Nothing to Preview</Text><Text fontSize="xl" color="whiteAlpha.800"><MdSpeakerNotesOff/></Text> </>: <Text color="white">Loading...</Text>}</Flex> : <>
        {data?.map((data)=>{
          return  <Flex w="100%" h="100%" maxH="72px" minH="72px" gap="1rem" overflow="hidden" color="whiteAlpha.700" bg={"gray.800"} align="center">
          <Box w="100%" maxW="50px" h="50px" borderRadius="100%" overflow="hidden" ml="1rem">
          <Img  src={data.profile ? !isUrl(data.profile) ? process.env.REACT_APP_SERVER_URL + "/" + data?.profile : data?.profile : Profile} w="100%" h="100%" objectFit="cover"/>
          </Box>
          <Flex p=".5rem" borderBottom="1px" borderColor="whiteAlpha.300" w="100%" alignItems="end" justify="space-between">
           <Flex flexDir="column"> <Text>{data.username}</Text>
            <Text fontSize="smaller">{data.email}</Text></Flex>
            <Flex>{!data.isAlreadyFriend ? <Button size="sm" onClick={()=>addfriend(data?._id)}>Add friend</Button> : <Button size="sm" px="1" onClick={()=>removefriend(data?._id)}>Remove friend</Button>}</Flex>
          </Flex>
          
        </Flex>
        })}
        </>}
       </Flex>
      </Box>}
    </Flex>
  );
};

export default AllChat;
