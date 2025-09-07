import React, { createContext, useContext, useState } from 'react';
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import spiltCoffeeErrorSvg from '../assets/images/spiltCoffeeError.svg';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
  });

  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showDialog = (options) => {
    setDialog({
      open: true,
      title: options.title || 'Confirm',
      message: options.message || 'Are you sure?',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm || (() => {}),
      onCancel: options.onCancel || (() => {}),
    });
  };

  const hideDialog = () => {
    setDialog({ ...dialog, open: false });
  };

  const handleDialogConfirm = () => {
    dialog.onConfirm();
    hideDialog();
  };

  const handleDialogCancel = () => {
    dialog.onCancel();
    hideDialog();
  };

  return (
    <AlertContext.Provider
      value={{
        showSnackbar,
        hideSnackbar,
        showDialog,
        hideDialog,
      }}
    >
      {children}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton size="small" color="inherit" onClick={hideSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog for confirmations */}
      <Dialog
        open={dialog.open}
        onClose={handleDialogCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} color="primary">
            {dialog.cancelText}
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" autoFocus>
            {dialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};
