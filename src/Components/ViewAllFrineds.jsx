import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Flex, IconButton, Img, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, useToast } from "@chakra-ui/react";
import {AiOutlineClose} from "react-icons/ai"
import {MdPersonOff , MdPersonAddAlt1} from "react-icons/md"
import {CiMenuKebab } from "react-icons/ci"
import Profile from "../Assets/Images/profile.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/ContextProvider";

const ViewAllFrineds = ({ closefrienddrawer , isSearch}) => {
  const [isloading , setIsLoading] = useState(true)
  const { isUrl , getbasicdata} = useContext(MyContext);
  const [data , setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const toast = useToast();
  const navigate = useNavigate();
 function Toast(title , status){
    return toast({
      description: title,
      status: status || 'error',
      duration: 3500,
      isClosable: true,
      position : "top-right"
    })
  }
  const getfriends = async(e) => {
    setIsLoading(true)
    await axios({
      method : "POST",
      url : process.env.REACT_APP_SERVER_URL + "/getfriends",
      headers : {
        "Content-Type" : "application/json",
        "bearer-token" : localStorage.getItem('chat-token')
      }
    }).then((res)=>{
      setIsLoading(false)
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
  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilter(filterValue);

    // Apply the filter based on the username of the friend
    const filteredItems = data?.filter((item) =>
      item?.friend?.email?.toLowerCase().includes(filterValue.toLowerCase())
    );

    setFilteredData(filteredItems);
  };
  const startChat = async(userId) =>{
   await axios({
    method:"POST",
    url : process.env.REACT_APP_SERVER_URL + "/createchat/" + userId,
    headers : {
      "Content-Type" : "application/json",
      "bearer-token" : localStorage.getItem("chat-token")
    }
   }).then((res)=>{
   if(res.data.status){
    navigate("/user/" + res.data.Data._id + "/" + userId)
    getbasicdata(localStorage.getItem("chat-token"))
   }else{
    Toast(res.data.message)
   }
   }).catch((err)=>{
    console.log(err.message)
    Toast(err.message)
   })
  }

 useEffect(()=>{
    getfriends()
 },[])
 useEffect(()=>{
    setFilteredData(data)
 },[data])

  const removefriend = async(id) => {
    await axios({
      method : "POST",
      url : process.env.REACT_APP_SERVER_URL + "/removefriend/" + id,
      headers : {
        "Content-Type" : "application/json",
        "bearer-token" : localStorage.getItem('chat-token')
      }
    }).then((res)=>{
      if(res?.data?.status){
        getfriends()
        Toast(res.data.message , "success")
      }else{
        Toast(res.data.message)
      }
    }).catch((err)=>{
      Toast(err.message)
      console.log(err.message)
    })
  }

  return (
    <Flex flexDir="column" bg="blackAlpha.800" maxH="100vh" h="100vh" overflow="scroll" pos="relative">
     <Box w="100%" h="100%" pos="absolute" bg="gray.800">
       <Flex h="100px" justify="center" flexDir='column' px="1rem" gap=".5rem" bg="gray.900" pos="sticky" top={0}>
        <Flex justify="space-between" align="center"><Text fontSize="xl" color="white">Your friends</Text> <IconButton bg="transparent" colorScheme="transparent" fontSize="2xl" icon={<AiOutlineClose title="close" onClick={()=>{closefrienddrawer(); setData([]);}} />}/> </Flex>
        <Input focusBorderColor="white" placeholder="Search user by gmail" color="white" value={filter} onChange={handleFilterChange}/>
       </Flex>
       <Flex maxH="100%" w="100%" overflowX="hidden" overflowY="scroll" flexDir="column" my=".5rem">
        {data.length === 0 ? <Flex align="center" gap="1" mt="50px" justify="center">{!isloading ?<Flex w="100%" flexDir="column" gap={2} align="center" px="1rem"><Flex gap={1} align="center"> <Text fontSize="xl" color="whiteAlpha.800">You don't have any friends</Text><Text fontSize="xl" color="whiteAlpha.800"><MdPersonOff/></Text></Flex> <Button fontSize="lg" w="100%" onClick={isSearch}>Make new friends <MdPersonAddAlt1/></Button> </Flex>:<Flex gap={2} align="center" flexDir="column"><Spinner size='lg' color="white"/> <Text color="white">Loading...</Text></Flex>}</Flex> : <>{filteredData.length !== 0 ? <>
        {filteredData?.map((data)=>{
          return  <Flex w="100%" h="100%" maxH="72px" minH="72px" gap="1rem" overflow="hidden" color="whiteAlpha.700" bg={"gray.800"} align="center">
          <Box w="100%" maxW="50px" h="50px" borderRadius="100%" overflow="hidden" ml="1rem">
          <Img  src={data?.friend?.profile ? !isUrl(data?.friend?.profile) ? process.env.REACT_APP_SERVER_URL + "/" + data?.friend?.profile : data?.friend?.profile : Profile} w="100%" h="100%" objectFit="cover"/>
          </Box>
          <Flex p=".5rem" borderBottom="1px" borderColor="whiteAlpha.300" w="100%" alignItems="end" justify="space-between">
           <Flex flexDir="column"> <Text>{data?.friend?.username}</Text>
            <Text fontSize="small" fontWeight="light">{data?.friend?.email}</Text></Flex>
            <Flex>
            <Menu size="sm">
                <MenuButton><IconButton icon={<CiMenuKebab color="white"/>} bg="transparent"/> </MenuButton>
                  <MenuList color="black">
                    <MenuItem onClick={()=>startChat(data?.friend?._id)}>Start chat</MenuItem>
                    <MenuDivider/>
                    <MenuItem onClick={()=>removefriend(data?.friend?._id)}>Remove friend</MenuItem>
                  </MenuList>
            </Menu>
            </Flex>
          </Flex>        
        </Flex>
        })}
        </> : <Flex pt="2rem" color="white" justify="center">No Match Found</Flex>}</>}
       </Flex>
      </Box>
    </Flex>
  );
};

export default ViewAllFrineds;
