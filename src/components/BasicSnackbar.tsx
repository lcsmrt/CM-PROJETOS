import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export interface IBasicSnackbar {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose?: () => void;
}

const BasicSnackbar: React.FC<IBasicSnackbar> = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
      <Alert
        onClose={onClose}
        severity={severity ?? "info"}
        sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BasicSnackbar;