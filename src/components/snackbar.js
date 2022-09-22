import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import makeStyles from '@material-ui/core/styles/makeStyles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    alignItems: 'center',
    fontSize: 13,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 13,
  },
}));

const MySnackbarContent = ({ className, message, onClose, variant }) => {
  const Icon = variantIcon[variant];
  const classes = useStyles();

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      style={{
        display: 'flex',
      }}
    />
  );
};

MySnackbarContent.propTypes = {
  message: PropTypes.node,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

MySnackbarContent.defaultProps = {
  message: '',
  className: '',
};

const MySnackbarContentWrapper = MySnackbarContent;

const CustomizedSnackbars = ({ message, variant }) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      setOpen(false);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    return () => {
      setOpen(false);
    };
  }, [message]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant={variant}
          message={message}
        />
      </Snackbar>
    </div>
  );
};

CustomizedSnackbars.propTypes = {
  message: PropTypes.node,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

CustomizedSnackbars.defaultProps = {
  message: '',
};

export default CustomizedSnackbars;
