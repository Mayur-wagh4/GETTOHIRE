import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => (
  <Dialog open={isOpen} handler={onClose}>
    <DialogHeader>Confirmation</DialogHeader>
    <DialogBody>{message}</DialogBody>
    <DialogFooter>
      <Button variant="text" color="red" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="gradient" color="green" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </Dialog>
);

export default ConfirmationDialog;
