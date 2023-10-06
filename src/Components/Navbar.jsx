import { Box, Flex, IconButton, Img, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import Profile from "../Assets/Images/profile.jpg";
import { useContext, useState } from "react";
import {MyContext} from "../context/ContextProvider";
import {BsPersonAdd} from "react-icons/bs"
import ProfileDrawer from "../Components/ProfileDrawer"
import { useNavigate } from "react-router-dom";

const Navbar = ({isSearch , closeall}) => {
  const navigate = useNavigate();
  const [isOpen , setIsOpen] = useState(false)
  let data = JSON.parse(localStorage.getItem("user-data"));
  const {isUrl , userData} = useContext(MyContext)
  const closeDrawer = () => {setIsOpen(false)}
  function logout (){
    localStorage.clear()
    navigate("/")
  }

  return (
    <Flex background="gray.900" align="center" p=".5rem 1rem" gap="1rem">
      <ProfileDrawer isopen={isOpen} isclose={closeDrawer}/>
      <>
      <Box w="40px" h="40px" borderRadius="100%" overflow="hidden">
        <Menu>
          <MenuButton>
          <Img  src={userData?.profile ? !isUrl(userData.profile) ? process.env.REACT_APP_SERVER_URL + "/" + userData?.profile : userData?.profile : Profile} w="100%" h="100%" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={()=>setIsOpen(true)}>View Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Text color="white" fontSize="xl" cursor="pointer" onClick={()=>{navigate("/home");closeall()}}>
        {data?.username}
      </Text>
      </>
      <IconButton ms="auto" onClick={isSearch} fontSize="2xl" icon={<BsPersonAdd title="Add friends"/>} bg="transparent" colorScheme="transparent"/>
    </Flex>
  );
};

export default Navbar;
