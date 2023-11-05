import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaCircleLeft } from "react-icons/fa6";

const ForgotPassword = ({ goback , deta}) => {
  const [data, setData] = useState({ email: "", otp: "", newPass: "" });
  const [isLoading , setIsLoading] = useState(false)
  const { email, otp, newPass } = data;
  const [isEmail, setIsEmail] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
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
  const onchange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleclick = (e) => {
    e.preventDefault()
    if (isEmail && !isOtp) {verifyotppass(e)}
    if(isEmail && isOtp){updatePass(e)}
    if(!isEmail && !isOtp){checkEmail(e)}
  };

  const checkEmail = async (e) => {
    e.preventDefault();
    if (!email) {Toast("Email is required");return;}
    setIsLoading(true)
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/forgotpassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
      },
    })
      .then((res) => {
        setIsLoading(false)
        if (res?.data?.status) {
          setIsEmail(true)
          Toast(res?.data?.message, "success");
        } else {
          Toast(res?.data?.message);
        }
      })
      .catch((err) => {
        Toast(err?.message);
        console.log("err in Verification" + err?.message);
      });
  };

  const verifyotppass = async (e) => {
    e.preventDefault();
    if (!otp) {Toast("OTP is required");return;}
    if (otp.length > 4 || otp.length < 4) {Toast("OTP must contain only 4 numbers");return;}
    setIsLoading(true)
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/verifyotppass`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
        otp: Number(otp),
      },
    })
      .then((res) => {
        setIsLoading(false)
        if (res?.data?.status) {
          setIsOtp(true)
          Toast(res?.data?.message, "success");
        } else {
          Toast(res?.data?.message);
        }
      })
      .catch((err) => {
        Toast(err?.message);
        console.log("err in Verification" + err?.message);
      });
  };
  const updatePass = async (e) => {
    e.preventDefault();
    if (!newPass) {Toast("Password is required"); return; }
    setIsLoading(true)
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/resetPassword`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
        password: newPass,
      },
    })
      .then((res) => {
        setIsLoading(false)
        if (res?.data?.status) {
          Toast(res?.data?.message, "success");
          goback()
        } else {
          Toast(res?.data?.message);
        }
      })
      .catch((err) => {
        Toast(err?.message);
        console.log("err in Verification" + err?.message);
      });
  };

  return (
    <Box as="form" onSubmit={handleclick}>
      <Text fontSize="3xl" color="black" mb={5} mt="-10">
        Forgot Password
      </Text>
      <Stack spacing={4}>
        <Input
        isDisabled={isEmail}
          type="email"
          placeholder="Enter your email"
          bg={"gray.100"}
          border={0}
          color={"black"}
          _placeholder={{color: "gray.500",}}
          name="email"
          value={email}
          onChange={onchange}
        />
        {isEmail && (
          <Input
            isDisabled={isOtp}
            placeholder="Enter your otp"
            bg={"gray.100"}
            border={0}
            color={"black"}
            _placeholder={{color: "gray.500",}}
            name="otp"
            value={otp}
            onChange={onchange}
            type="number"
          />
        )}
        {isOtp && (
          <Input
            type="password"
            placeholder="New Password"
            bg={"gray.100"}
            border={0}
            color={"black"}
            _placeholder={{color: "gray.500",}}
            name="newPass"
            value={newPass}
            onChange={onchange}
            minLength={5}
          />
        )}
      </Stack>
      <Button
        fontFamily={"heading"}
        isLoading={isLoading}
        mt={8}
        w={"full"}
        bgGradient="linear(to-r, red.400,pink.400)"
        color={"white"}
        _hover={{
          bgGradient: "linear(to-r, red.400,pink.400)",
          boxShadow: "xl",
        }}
        type="submit">
        Submit
      </Button>
      <Flex
        justify="center"
        alignItems="center"
        color="black"
        gap={2}
        mt=".5rem">
        <FaCircleLeft size="22px" onClick={goback} cursor="pointer" />
        <Text onClick={()=>{goback(); deta()}} cursor="pointer">
          Back to Login
        </Text>
      </Flex>
    </Box>
  );
};

export default ForgotPassword;
