import { Box, Button, Flex, IconButton, Input, Spinner, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import { FaUserGroup } from "react-icons/fa6";
import ViewAllFrineds from "./ViewAllFrineds";
import { MyContext } from "../context/ContextProvider";

const Chats = ({
  openfrinedDrawer,
  isfrinedDrawer,
  closefrienddrawer,
  isSearch,
}) => {
  const { totalChats } = useContext(MyContext);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState(totalChats);
  const [loader, setLoader] = useState(totalChats);

  useEffect(() => {
    setLoader(true)
    setFilteredData(totalChats);
    if(totalChats.length !== 0){
      setLoader(false)
    }
  }, [totalChats]);

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilter(filterValue);

    const filteredItems = totalChats?.filter((item) =>
      item?.reciever?.email?.toLowerCase().includes(filterValue.toLowerCase())
    );

    setFilteredData(filteredItems);
  };

  return (
    <Flex
      flexDir="column"
      h="100%"
      overflowY="scroll"
      className="chats"
      bg="gray.800"
    >
      {!isfrinedDrawer ? (
        <>
          <Flex
            gap="1"
            h="70px"
            w="100%"
            p=".5rem"
            bg="gray.800"
            pos="sticky"
            top="0"
          >
            <Input
              type="text"
              w="90%"
              bg="gray.700"
              color="whiteAlpha.700"
              placeholder="Search chat here"
              value={filter}
              onChange={handleFilterChange}
            />
            <IconButton
              onClick={openfrinedDrawer}
              bg="transparent"
              fontSize="xl"
              colorScheme="transparent"
              icon={<FaUserGroup color="white" title="View all friends" />}
            />
          </Flex>
          {totalChats?.length !== 0 ? (
            filteredData?.map((data) => {
              return <ChatBox key={data?._id} data={data} />;
            })
          ) : (
            <Flex w="100%" h="50%" alignItems="center" p="1rem" flexDir="column" justify="center" gap="2">
              {!loader ? (
                <Button w="100%" rounded="100" onClick={openfrinedDrawer}>
                  Start a new chat
                </Button>
              ) : (
               <> <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="gray.500"
                  size="xl"
                  mx="auto"
                />
                <Text color="white">Loading Chats . . .</Text></>
              )}
            </Flex>
          )}
        </>
      ) : (
        <ViewAllFrineds
          closefrienddrawer={closefrienddrawer}
          isSearch={isSearch}
        />
      )}
    </Flex>
  );
};

export default Chats;
