import React, { useState, useEffect } from "react";
import { useToast, Button } from "@chakra-ui/react";

function ButtonToast(props) {
  const { handleSave, children, toastMessage } = props;

  const handleButtonClick = async () => {
    handleSave();
  };

  const toast = useToast();

  useEffect(() => {
    if (toastMessage) {
      const { title, description, status, duration } = toastMessage;
      toast({
        title,
        description: description,
        status: status,
        duration: duration,
        isClosable: true,
      });
    }
  }, [toastMessage, toast]);

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleButtonClick();
        }}
        {...props}
      >
        {children}
      </Button>
    </>
  );
}

export default ButtonToast;
