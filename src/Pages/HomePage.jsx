import { Box, Img } from "@chakra-ui/react";
import backgorundImage from "../Assets/Images/backgorundImage.jpg";
import AllChat from "../Components/AllChat";

const HomePage = () => {
  const style = {
    position: "absolute",
    content: '""',
    top: "0",
    left: "0;",
    width: "100%",
    height: "100%",
    background: "rgba(45,55,72,.5)",
  };
  return (
    <>
    <Box w="100%" h="100%" display={{base: "none" , sm:"block"}} className="bannerBox" pos="relative" _before={ style } backgroundImage={backgorundImage}></Box>
    <Box display={{base: "block" , sm:"none"}} className="bannerchat"><AllChat/></Box>
    </>
  );
};

export default HomePage;
