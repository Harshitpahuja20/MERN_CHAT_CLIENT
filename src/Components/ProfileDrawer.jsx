import {Box,Button,Drawer,DrawerBody,DrawerCloseButton,DrawerContent,DrawerHeader,DrawerOverlay,Flex,IconButton,Img,Input,useDisclosure,useToast,} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import profileImg from "../Assets/Images/profile.jpg";
import axios from "axios";
import { BsCameraFill } from "react-icons/bs";
import { MyContext } from "../context/ContextProvider";

function ProfileDrawer({ isopen, isclose }) {
  const { userData, getbasicdata , isUrl } = useContext(MyContext);
  const [data, setData] = useState({
    username: userData?.username,
    status: userData?.status,
    profile: userData?.profile,
  });
  const { username, status, profile } = data;
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

  useEffect(() => {
    setData({
      ...data,
      username: userData?.username,
      status: userData?.status,
      profile: userData?.profile,
    });
  }, [userData]);

  const { onClose } = useDisclosure();
  const btnRef = useRef();
  const onchange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || username.length < 3) {Toast("Username must contain 3 letters"); return}
    const formData = new FormData();
    formData.append("username", username);
    formData.append("status", status);
    formData.append("profile", profile);
    await axios({
      method: "POST",
      url: process.env.REACT_APP_SERVER_URL + "/updateuser",
      headers: {
        "Content-Type": "multipart/form-data",
        "bearer-token": localStorage.getItem("chat-token"),
      },
      data: formData,
    })
      .then((res) => {
        if (res.data.status) {
          localStorage.setItem("chat-token", res.data.token)
          getbasicdata(res.data.token);
          Toast(res.data.message, "success");
        } else {
          Toast(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        Toast(err.message)
      });
  };

  const onchange2 = (e) => {
    const files = e.target.files[0];
    setData({ ...data, profile: files });
    if (files) {
      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.addEventListener("load", () => {
        document.querySelector(".img").src = reader.result;
      });
    }
  };

  return (
    <>
      <Drawer
        isOpen={isopen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        colorScheme="gray.900"
        variant="gray.900"
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.700">
          <DrawerCloseButton onClick={isclose} color="white" />
          <DrawerHeader color="white">Update Profile</DrawerHeader>

          <DrawerBody>
            <Flex
              gap="1.5rem"
              flexDir="column"
              as={"form"}
              encType="multipart/form-data"
              autoComplete="off"
            >
              <Box w="120px" h="120px" mx="auto" pos="relative">
                <Img
                 src={profile ? !isUrl(profile) ? process.env.REACT_APP_SERVER_URL + "/" + profile : profile : profileImg}
                  className="img"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  rounded="full"
                  border="1px"
                  p="1"
                />
                <IconButton
                  icon={<BsCameraFill />}
                  zIndex="10"
                  bg="green.400"
                  pos="absolute"
                  bottom="0%"
                  right="5%"
                  size="sm"
                  borderRadius="100%"
                  onClick={() => document.querySelector(".file").click()}
                />
              </Box>
              <Box>
                <Input
                  border={0}
                  color="white"
                  borderBottom="1px solid white"
                  borderRadius={0}
                  placeholder="username"
                  _focus={{ border: "none", borderBottom: "1px solid white" }}
                  focusBorderColor="transparent"
                  value={username}
                  name="username"
                  onChange={onchange}
                />
              </Box>
              <Box>
                <Input
                  border={0}
                  color="white"
                  borderBottom="1px solid white"
                  borderRadius={0}
                  placeholder="status"
                  _focus={{ border: "none", borderBottom: "1px solid white" }}
                  focusBorderColor="transparent"
                  value={status}
                  name="status"
                  onChange={onchange}
                />
              </Box>
              <Box>
                <Button w="100%" onClick={handleSubmit} isDisabled={username === userData?.username && status === userData?.status && profile === userData?.profile}>
                  Update
                </Button>
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Input
        type="file"
        display="none"
        className="file"
        accept="image/*"
        onChange={onchange2}
      />
    </>
  );
}

export default ProfileDrawer;
