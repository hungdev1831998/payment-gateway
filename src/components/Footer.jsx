import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";

const Footer = React.forwardRef((props, ref) => {
  const navigate = useNavigate();

  return (
    <Box
      bg={useColorModeValue("gray.200", "gray.900")}
      color={useColorModeValue("#1A202C", "white")}
    >
      <Container maxW="container.xl">
        <Box maxW={1375} padding={{ base: "20px 10px", md: "50px 20px" }}>
          <Box>
            <Flex
              direction={"column"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
              gridColumnGap={"9px"}
              gridRowGap={"9px"}
            >
              <Heading fontSize={{ base: "2xl", md: "2xl" }}>
                Payment Gateway
              </Heading>
              <Box
                display={{ base: "block", md: "flex" }}
                mt={5}
                mb={{ base: 0, md: 5 }}
                width="100%"
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={5}
              >
                <Box
                  borderBottom={"1px solid #344654"}
                  width={{ base: "100%", md: "100%" }}
                ></Box>
              </Box>
            </Flex>
          </Box>
          <Box style={{ margin: "0 auto" }} className="button-text-14-16">
            © 2024 Payment-Gateway
          </Box>
        </Box>
      </Container>
    </Box>
  );
});

export default Footer;
