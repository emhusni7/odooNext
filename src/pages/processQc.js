import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes, { array } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DetailQcPage from './detailQc';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    paddingBlock: 10,
    padding: 10,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const FullScreenDialog = ({ record, idx, addScrap, msg, enabled }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Reject/Scrap
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Scrap / Mutasi / Reproses
            </Typography>
          </Toolbar>
        </AppBar>
        <DetailQcPage
          record={record}
          idx={idx}
          addScrap={addScrap}
          msg={msg}
          enabled={enabled}
        />
      </Dialog>
    </div>
  );
};

export default FullScreenDialog;

FullScreenDialog.propTypes = {
  record: PropTypes.instanceOf(array).isRequired,
  idx: PropTypes.number.isRequired,
  addScrap: PropTypes.func.isRequired,
  msg: PropTypes.func.isRequired,
  enabled: PropTypes.func.isRequired,
};
