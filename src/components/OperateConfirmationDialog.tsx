import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface OperateConfirmationDialogProps {
  open: boolean;
  title: string;
  content: string;
  data?: any;
  onConfirm: (data?: any) => void;
  onCancel: () => void;
}

const OperateConfirmationDialog: React.FC<OperateConfirmationDialogProps> = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancle
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OperateConfirmationDialog;
