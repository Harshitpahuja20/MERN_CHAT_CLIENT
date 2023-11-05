import { Box, Button, Flex, HStack, Input, PinInput, PinInputField, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import {FcGoogle} from "react-icons/fc"
import axios from "axios"
import { useGoogleLogin } from '@react-oauth/google';

const LoginComp = () => {
  let deta = {email : "" , password : "" , username : ""}
  const [data , setData] = useState(deta)
  const [otp , setotp] = useState({i1 : "" , i2 : "" , i3 : "" , i4 : ""})
  const {email , password , username} = data
  const [islogin, setislogin] = useState(true)
  const [forgot , setForgot] = useState(false)
  const [userVerify , setUserVerify] = useState(false)
  const [disable , setDisable] = useState(false)
  const toast = useToast();
  const goback = () => {setForgot(false)}
  function Toast(title , status){
    return toast({
      description: title,
      status: status || 'error',
      duration: 3500,
      isClosable: true,
      position : "top-right"
    })
  }
  const onchange = (e) => {setData({...data , [e.target.name] : e.target.value})}
  const onotpchange = (e) => {setotp({...otp , [e.target.name] : e.target.value})}
  const signupFunc = async(e) =>{
    e.preventDefault()
    if(!username){Toast("Username is required"); return}
    if(!email){Toast("Email is required"); return}
    if(!password){Toast("Password is required"); return}
    setDisable(true)
     await axios({
      method : "POST",
      url : `${process.env.REACT_APP_SERVER_URL}/createUser`,
      headers : {
          "Content-Type" : "application/json"
      },
      data : {
          email : email,
          password : password,
          username : username
      }
   }).then((res)=>{
    setDisable(false)
    if(res?.data?.status){
      setUserVerify(true)
      Toast(res?.data?.message , "success")
    }else{
      Toast(res?.data?.message)
    }
   }).catch((err)=>{
    Toast(err?.message)
    console.log("Err in Creating account" + err?.message)
   })
  }

  const loginFunc = async(e) =>{
    e.preventDefault()
    if(!email){Toast("Email is required"); return}
    if(!password){Toast("Password is required"); return}
    setDisable(true)
     await axios({
      method : "POST",
      url : `${process.env.REACT_APP_SERVER_URL}/getUser`,
      headers : {
          "Content-Type" : "application/json"
      },
      data : {
          email : email,
          password : password
      }
   }).then((res)=>{
    setDisable(false)
    if(res?.data?.status){
      localStorage.setItem("chat-token" , res?.data?.token)
      localStorage.setItem("user-data" , JSON.stringify(res?.data?.data))
      Toast(res?.data?.message , "success")
      window.location.reload()
    }else{
      Toast(res?.data?.message)
    }
   }).catch((err)=>{
    Toast(err?.message)
    console.log("err in login" + err?.message)
   })
  }

  const otpVerification = async(e)=>{
    e.preventDefault()
    if(!otp.i1 || !otp.i2 || !otp.i3 || !otp.i4){Toast("OTP is required"); return}
    setDisable(true)
    let OTP = otp.i1 + otp.i2 + otp.i3 + otp.i4
     await axios({
      method : "POST",
      url : `${process.env.REACT_APP_SERVER_URL}/verifyuser`,
      headers : {
          "Content-Type" : "application/json"
      },
      data : {
          email : email,
          otp : Number(OTP)
      }
   }).then((res)=>{
    setDisable(false)
    if(res?.data?.status){
      localStorage.setItem("chat-token" , res?.data?.token)
      localStorage.setItem("user-data" , JSON.stringify(res?.data?.data))
      Toast(res?.data?.message , "success")
      window.location.reload()
    }else{
      Toast(res?.data?.message)
    }
   }).catch((err)=>{
    Toast(err?.message)
    console.log("err in Verification" + err?.message)
   })
  }

  const googlelogin = useGoogleLogin({
    onSuccess: tokenResponse => {
     axios.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + tokenResponse?.access_token).then(async(res) =>{
      await axios({
        method : "POST",
        url : `${process.env.REACT_APP_SERVER_URL}/socialSignup`,
        headers : {
            "Content-Type" : "application/json"
        },
        data : {
            email : res.data.email,
            username : res.data.name,
            profile : res.data.picture
        }
      }).then((res)=>{
        setDisable(false)
        if(res?.data?.status){
          localStorage.setItem("chat-token" , res?.data?.token)
          localStorage.setItem("user-data" , JSON.stringify(res?.data?.data))
          Toast(res?.data?.message , "success")
          window.location.reload()
        }else{
          Toast(res?.data?.message)
        }
      }).catch((err)=>{
        console.log(err.message)
        Toast(err.message)
      })
    })
    },
    onError : () => console.log('Login Failed')
  })

  return (
    <Box mt={10}>
      {forgot ? <ForgotPassword goback={goback} deta={()=>setData(deta)}/> : islogin ? (
        <Box as="form" onSubmit={loginFunc}>
        <Text fontSize={{base : "2xl" , md: "4xl"}} color="black" mb={5} mt="-10">User Login</Text>
          <Stack spacing={4}>
          <Input
            type="email"
              placeholder="xyz@gmail.com"
              bg={"gray.100"}
              border={0}
              color={"gray.800"}
              _placeholder={{
                color: "gray.500",
              }}
              name="email"
              value={email}
              onChange={onchange}
            />
            <Input
            type="password"
              placeholder="e.g :- xyz@123"
              bg={"gray.100"}
              border={0}
              color={"gray.800"}
              _placeholder={{
                color: "gray.500",
              }}
              name="password"
              value={password}
              onChange={onchange}
            />
            <Text color={"gray.800"} w="fit-content" ms="auto" _hover={{color:"gray.900"}} cursor="pointer" onClick={()=>setForgot(true)}>Forgot Password ?</Text>
          </Stack>
          <Button
          isLoading={disable}
            type="submit"
            fontFamily={"heading"}
            mt={4}
            w={"full"}
            bgGradient="linear(to-r, red.400,pink.400)"
            color={"white"}
            _hover={{
              bgGradient: "linear(to-r, red.400,pink.400)",
              boxShadow: "xl",
            }}
          >
            Login
          </Button>
          <Flex color="black" mt={3} justify="center">
            <Text>Don't have an account?</Text>
            <Text textDecor="underline" color="blue.500" onClick={()=>{setislogin(false); setData(deta)}} cursor="pointer">Signup here</Text>
          </Flex>
        </Box>
      ) :  (<>
       {!userVerify ? <Box as="form" onSubmit={signupFunc}>
        <Text fontSize={{base : "2xl" , md: "4xl"}} color="black" mb={5} mt="-10">Create Account here</Text>
          <Stack spacing={4}>
            <Input
              placeholder="Username"
              bg={"gray.100"}
              border={0}
              color={"gray.800"}
              _placeholder={{
                color: "gray.500",
              }}
              name="username"
              value={username}
              onChange={onchange}
            />
            <Input
              type="email"
              placeholder="xyz@gmail.com"
              bg={"gray.100"}
              border={0}
              color={"gray.800"}
              _placeholder={{
                color: "gray.500",
              }}
              name="email"
              value={email}
              onChange={onchange}/>
            <Input
            type="password"
              placeholder="e.g :- xyz@123"
              bg={"gray.100"}
              border={0}
              color={"gray.800"}
              _placeholder={{
                color: "gray.500",
              }}
              name="password"
              value={password}
              onChange={onchange}
              minLength={5}/>
          </Stack>
          <Button
          isLoading={disable}
            type="submit"
            fontFamily={"heading"}
            mt={6}
            w={"full"}
            bgGradient="linear(to-r, red.400,pink.400)"
            color={"white"}
            _hover={{
              bgGradient: "linear(to-r, red.400,pink.400)",
              boxShadow: "xl",
            }}>
            Sign up
          </Button>
          <Flex color="black" mt={3} justify="center">
            <Text>Already have an account?</Text>
            <Text textDecor="underline" color="blue.500" onClick={()=>{setislogin(true); setData(deta)}} cursor="pointer">Signin here</Text>
          </Flex>
        </Box> : <Flex as='form' justify="center" flexDir="column" align="center" onSubmit={otpVerification}>
        <Text fontSize={{base : "2xl" , md: "3xl"}} color="black" mt="-10">Email Verification</Text>
        <Text color="gray" fontSize="xs" textAlign="center">Please enter the One-Time-Password to verify your account.</Text>
        <Text color="gray" fontSize="xs" mb={3} textAlign="center">A One-Time-Password has been sent to <Text as="span" textDecor="underline" color="black">{email}</Text></Text>
        <HStack mx="auto">
                <PinInput>
                  <PinInputField w='3.2rem' h="3.2rem" color="black" value={otp.i1} name="i1" onChange={onotpchange}/>
                  <PinInputField w='3.2rem' h="3.2rem" color="black" value={otp.i2} name="i2" onChange={onotpchange}/>
                  <PinInputField w='3.2rem' h="3.2rem" color="black" value={otp.i3} name="i3" onChange={onotpchange}/>
                  <PinInputField w='3.2rem' h="3.2rem" color="black" value={otp.i4} name="i4" onChange={onotpchange}/>
                </PinInput>
             </HStack>
             <Button w="50%" fontFamily={"heading"}
             isLoading={disable}
             type="submit"
             mt={4}
             bgGradient="linear(to-r, red.400,pink.400)"
             color={"white"}
             _hover={{
              bgGradient: "linear(to-r, red.400,pink.400)",
              boxShadow: "xl",
            }}>Verify</Button>
          </Flex>}
        </>)}
       {!userVerify && <Flex flexDir="column">
          <Flex justify="center" align="center" w="100%">
            <Box w="100%" h="2px" bg="gray.200"></Box>
            <Box color="gray.600" mx="5">OR</Box>
            <Box w="100%" h="2px" bg="gray.200"></Box>
          </Flex>
          <Button fontFamily={"heading"}
          isDisabled={disable}
            mt={4}
            bg="gray.800"
            colorScheme="gray.800"
            color={"white"}
            onClick={googlelogin}
            rightIcon={<FcGoogle/>}>Continue with google</Button>
        </Flex>}
    </Box>
  );
};

export default LoginComp;
