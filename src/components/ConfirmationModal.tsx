import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

export interface IConfirmationModal {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText?: string;
  confirmButtonColor?: "primary" | "inherit" | "secondary" | "success" | "error" | "info" | "warning";
  cancelButtonText?: string;
  cancelButtonColor?: "primary" | "inherit" | "secondary" | "success" | "error" | "info" | "warning";
}

const ConfirmationModal: React.FC<IConfirmationModal> = ({ ...props }) => {
  return (
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} color={props.cancelButtonColor ?? "primary"}>
          {props.cancelButtonText ?? "Cancelar"}
        </Button>
        <Button onClick={props.onConfirm} color={props.confirmButtonColor ?? "primary"} autoFocus>
          {props.confirmButtonText ?? "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;