import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";

const PaymentMethodModal = ({ open, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleNext = () => {
    if (selectedMethod === "kakaopay") {
      navigate("/payment/kakaopay/register");
    } else if (selectedMethod === "creditcard") {
      navigate("/payment/card/register");
    }
    onClose();
  };

  const getButtonStyles = (method) => ({
    borderColor: selectedMethod === method ? "primary.main" : "grey.400",
    color: selectedMethod === method ? "primary.main" : "#B4B4B4",
    backgroundColor: "white",
    boxShadow:
      selectedMethod === method ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none",
    "&:hover": {
      borderColor: "primary.main",
      backgroundColor: "white",
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        등록할 결제수단을 선택해 주세요
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className="my-4">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<PaymentIcon />}
                className="w-full"
                onClick={() => handleSelect("kakaopay")}
                sx={getButtonStyles("kakaopay")}
              >
                카카오페이
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<CreditCardIcon />}
                className="w-full"
                onClick={() => handleSelect("creditcard")}
                sx={getButtonStyles("creditcard")}
              >
                체크/신용카드
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ width: "50%" }}
          disabled={!selectedMethod}
        >
          다음
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodModal;
