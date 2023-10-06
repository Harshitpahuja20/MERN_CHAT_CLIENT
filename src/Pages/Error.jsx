import { Box, Button, Flex, Heading, Img, Text } from "@chakra-ui/react";
import oops from "../Assets/Images/oops.png";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate()
  return (
    <Flex
      flexDir="column"
      py={10}
      px={6}
      justify="center"
      align="center"
      h="100vh"
    >
      <Box>
        <Img src={oops} />
      </Box>
      <Heading as="h3" size={{ base: "lg", md: "xl" }} mt={6} mb={2}>
        404 - Page not found
      </Heading>
      <Text maxW="350px" textAlign="center">
        The page you are looking for might have had its name changed or is
        temporarily unavilable .
      </Text>
      <Button
        bg="brand"
        color={"white"}
        mt="1rem"
        rounded="full"
        onClick={()=>navigate("/")}
        _hover={{bg:"brand"}}
      >
        GO TO HOMEPAGE
      </Button>
    </Flex>
  );
};

export default PageNotFound;
