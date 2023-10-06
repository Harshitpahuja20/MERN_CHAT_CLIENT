import { Box, Flex, Img, Text } from '@chakra-ui/react'
import React from 'react'

const MessageBox = ({msg , dir , me , ms}) => {
  return (
    <Box w="100%">
     <Flex gap="1rem" flexDir={dir || "row"} align="start" maxW="80%" me={me} ms={ms}>
        <Box maxW="40px" maxH="40px" borderRadius="full" overflow="hidden"><Img src="https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=" minW="100%" minH="100%"/></Box>
        <Text w="fit-content" bg={"gray.800"} p=".5rem 1rem" borderRadius={8}>{msg}</Text>
     </Flex>
    </Box>
  )
}

export default MessageBox