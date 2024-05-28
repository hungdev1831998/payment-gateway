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
  const url = new URL(window.location.href);
  let params_current_step = url.searchParams.get("step");
  let params_result = url.searchParams.get("result");
  let params_paymentId = url.searchParams.get('paymentId')
  let params_token = url.searchParams.get('token')
  let params_PayerID = url.searchParams.get('PayerID')

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(undefined);
  const [accessToken, setAccessToken] = useState('');
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: ENTRY_CODE_STEPS.length,
  });
  const [paypalLink, setPaypalLink] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('init')
  const [paymentResult, setPaymentResult] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)

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
    mutationFn: async ({data}) => {
      return await axios.post(
        `${process.env.REACT_APP_DOMAIN_SITE_URL}generic-payment/paypal/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
  });

  const paymentCallBack = useMutation({
    mutationFn: async ({token, PayerID, paymentId}) => {
      return await axios.get(
        `${process.env.REACT_APP_DOMAIN_SITE_URL}generic-payment/paypal/execute-payment?token=${token}&PayerID=${PayerID}&paymentId=${paymentId}`,
      );
    }
  })


  useEffect(()=> {
    if(params_paymentId && params_token && params_PayerID && loadingPayment === false) {
      console.log(111111333333)
      setLoadingPayment(true)
      paymentCallBack.mutateAsync(
        {
          paymentId: params_paymentId,
          PayerID: params_PayerID,
          token: params_token
        }
      )
      .then((result) => {
        console.log(11111111, result)
        setPaymentStatus(true)
        setPaymentStatus('finish')
        setPaypalLink(null)
        setLoading(false);
        reset();
      })
      .catch((error) => {
        setPaymentStatus(false)
        console.log(1111122222, error)
        setLoading(false);
      });
      setLoadingPayment(false)

    }
  }, [params_token, params_PayerID, params_paymentId])

  useEffect(()=> {
    if (params_current_step) {
      setActiveStep(parseInt(params_current_step))
    } 

  }, [params_result, params_current_step])

  useEffect(()=>{
    if (paymentStatus === 'in-processing' && paypalLink) {
      window.location.href = paypalLink
    }
  }, [paymentStatus, paypalLink])

  const onSubmit = async () => {
    setLoading(true);

    // if (activeStep === 2) {
    //   setTimeout(() => {
    //     setActiveStep(activeStep + 1);
    //     setLoading(false);
    //   }, 1500);
    //   return;
    // }

    const validate = checkValidate();
    if (!validate) return;

    const payload = {
      money: money,
    };

    console.log("payload", payload);
    
    if (activeStep === 2) {
      const money = payload?.money ? payload?.money: 0
      //Prepair data
      const data = {
        "transactions": [
            {
                "item_list": {
                    "items": [
                        {
                            "name": "item 1",
                            "sku": "item 1",
                            "price": money,
                            "currency": "USD",
                            "quantity": 1
                        }
                    ]
                },
                "amount": {
                    "total": money,
                    "currency": "USD"
                },
                "description": "This is the payment transaction description."
            }
        ]
      }
      await paymentGateway
        .mutateAsync({
          data,
        })
        .then((result) => {
          setPaymentStatus('in-processing')
          setPaypalLink(result?.data?.data?.result)
          // setActiveStep(activeStep + 1);
          setLoading(false);
          reset();
        })
        .catch((error) => {
          setLoading(false);
          setActiveStep(activeStep + 1);
        });
    } else {
      setTimeout(() => {
        setActiveStep(activeStep + 1);
        setLoading(false);
      }, 1500);
    }
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
              Cổng Thanh Toán
            </Text>

            <FormControl mt={10}>
              <FormLabel>Nhập số tiền cần thanh toán ($)</FormLabel>
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
              Cổng Thanh Toán
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
              {/* <CustomButton
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
              /> */}
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
            {paymentResult === true ? (
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
    return "Xác nhận";
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
          Demo Payment Gateway
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
