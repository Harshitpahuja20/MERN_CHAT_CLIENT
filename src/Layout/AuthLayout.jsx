import { Box, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import AllChat from "../Components/AllChat";

const MainComponent = () => {
  return (
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
  );
};

export default MainComponent;
