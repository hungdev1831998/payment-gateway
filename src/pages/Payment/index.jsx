import React, { useState, useEffect, useMemo } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import {
  Box,
  Text,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Button,
  Spinner,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import ButtonToast from "../../components/ButtonToast";
import { COLORS, ENTRY_CODE_STEPS } from "../../utils/_constants";
import { SkeletonRowComponent } from "../../components/FormController";
import { SvgPaypal } from "../../components/Svg/SvgPaypal";
import { SvgVenmo } from "../../components/Svg/SvgVenmo";
import { SvgPayLater } from "../../components/Svg/SvgPayLater";
import { SvgCreditCard } from "../../components/Svg/SvgCreditCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Payment = React.forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(undefined);
  const [accessToken, setAccessToken] = useState(null);
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: ENTRY_CODE_STEPS.length,
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues: { money: 1 },
    resolver: undefined,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,

    formState: { errors },
  } = methods;

  const [money] = watch(["money"]);

  console.log("money", money);

  const checkValidate = () => {
    console.log("hehe 2");
    if (!money) {
      setToastMessage({
        title: "Money Missing",
        description: "Something wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const paymentGateway = useMutation({
    mutationKey: ["paymentGateway"],
    mutationFn: async ({ payload }) => {
      return await axios.post(
        `${process.env.REACT_APP_DOMAIN_SITE_URL}/api/.../`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
  });

  const onSubmit = async () => {
    setLoading(true);

    if (activeStep === 2) {
      setTimeout(() => {
        setActiveStep(activeStep + 1);
        setLoading(false);
      }, 1500);
      return;
    }

    const validate = checkValidate();
    if (!validate) return;

    const payload = {
      money: money,
    };

    console.log("payload", payload);
    setTimeout(() => {
      setActiveStep(activeStep + 1);
      setLoading(false);
    }, 1500);

    // await paymentGateway
    //   .mutateAsync({
    //     payload,
    //   })
    //   .then(() => {
    //     setActiveStep(activeStep + 1);
    //     setLoading(false);
    //     reset();
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     setActiveStep(activeStep + 1);
    //   });
  };

  const renderContent = () => {
    // if (isLoading)
    //   return (
    //     <Box mt={4}>
    //       <SkeletonRowComponent />
    //     </Box>
    //   );

    const CustomButton = ({ bgColor, color, hoverColor, logo, text }) => (
      <Button
        bg={bgColor}
        color={color}
        height="50px"
        width="100%"
        _hover={{ bg: hoverColor }}
        sx={{
          _hover: {
            filter: "brightness(90%)",
          },
        }}
        mb={4}
      >
        <Box mr={2}>
          <Icon as={logo} w={6} h={6} />
        </Box>
        <Text>{text}</Text>
      </Button>
    );

    return (
      <>
        {activeStep === 1 && (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mt={6} textAlign="center">
              Payment Gateway
            </Text>

            <FormControl mt={10}>
              <FormLabel>Money</FormLabel>
              <Controller
                name={"money"}
                control={control}
                defaultValue={1}
                rules={{
                  required: "Money is required",
                  min: {
                    value: 1,
                    message: "Money must be at least 1",
                  },
                }}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    step={5}
                    min={1}
                    onChange={(value) => field.onChange(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              {errors?.money && <Box color="red">{errors?.money?.message}</Box>}
            </FormControl>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mt={6} textAlign="center">
              Payment Gateway
            </Text>
            <Box
              margin="0 auto"
              mt={10}
              width={{
                base: "100%",
                md: "50%",
                xl: "50%",
                "2xl": "50%",
              }}
            >
              <CustomButton
                bgColor="yellow.400"
                color="black"
                logo={SvgPaypal}
                text=""
              />
              <CustomButton
                bgColor="blue.500"
                color="white"
                logo={SvgVenmo}
                text=""
              />
              <CustomButton
                bgColor="yellow.400"
                color="black"
                logo={SvgPayLater}
                text="Pay Later"
              />
              <CustomButton
                bgColor="black"
                color="white"
                logo={SvgCreditCard}
                text="Debit or Credit Card"
              />
            </Box>
          </Box>
        )}
        {activeStep === 3 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            // p={4}
          >
            {paymentGateway?.isSuccess ? (
              <>
                <CheckCircleIcon w={20} h={20} color="green.500" />
                <Text fontSize="2xl" fontWeight="bold" mt={4}>
                  Thanh toán thành công!
                </Text>
              </>
            ) : (
              <>
                <WarningIcon w={20} h={20} color="red.500" />
                <Text fontSize="2xl" fontWeight="bold" mt={4}>
                  Thanh toán thất bại!
                </Text>

                <Text fontSize="xl" fontWeight="bold" mt={4}>
                  Số tiền không hợp lệ
                </Text>
              </>
            )}
          </Box>
        )}
      </>
    );
  };

  const buttonText = () => {
    return activeStep === 1 ? "Xác nhận" : "Hoàn thành";
  };

  return (
    <Box>
      <Header />
      <Box p={4} minHeight={"100vh"}>
        <Text
          mt={6}
          textAlign={"center"}
          as="h1"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight={{ base: 600, md: 600 }}
        >
          OnePAY
        </Text>
        <FormProvider>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={10} display="flex" justifyContent={"center"}>
              <Stepper
                index={activeStep}
                width={{
                  base: "100%",
                  md: "50%",
                  xl: "50%",
                  "2xl": "50%",
                }}
              >
                {ENTRY_CODE_STEPS.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box p={4} mt={4} display="flex" justifyContent={"center"}>
              <Box
                width={{
                  base: "100%",
                  md: "50%",
                  xl: "50%",
                  "2xl": "50%",
                }}
              >
                {renderContent()}
                <Box
                  mt={10}
                  mb={4}
                  display="flex"
                  width={"100%"}
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Box>
                    {activeStep !== 1 && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          if (activeStep > 1) setActiveStep(activeStep - 1);
                        }}
                        secondary
                      >
                        Quay lại
                      </Button>
                    )}
                  </Box>
                  <ButtonToast
                    mt={6}
                    ml={activeStep === 2 ? "auto" : 0}
                    disabled={loading}
                    handleSave={handleSubmit(onSubmit)}
                    backgroundColor={COLORS.BLUE}
                    color={COLORS.WHITE}
                    _hover={{
                      bgColor: COLORS.BLUE_HOVER,
                      color: COLORS.WHITE,
                    }}
                    toastMessage={toastMessage}
                  >
                    {loading ? (
                      <Spinner
                        thickness="2px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="white.500"
                        size="md"
                      />
                    ) : (
                      buttonText()
                    )}
                  </ButtonToast>
                </Box>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
      <Footer />
    </Box>
  );
});

export default Payment;
