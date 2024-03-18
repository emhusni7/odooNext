/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormHelperText from '@material-ui/core/FormHelperText';

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
  paper: {
    padding: 20,
    marginTop: 10,
    textAlign: 'left',
    inWidth: '100%',
  },
  textFieldColumn: {
    width: '100%',
    marginTop: 10,
  },
  labelDesign: {
    fontWeight: "bold"
  }
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const CorrActDialog = ({
  name,
  handleSave,
  disabled,
  setMsgBox,
  setLoading,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [corrAct, setCorrAct] = React.useState({
    code: '',
    name,
    note: '',
  });

  React.useEffect(() => {
    if (open) {
      setCorrAct({
        code: '',
        name: '',
        note: '',
      });
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setLoading(true);
    const res = handleSave(corrAct.code, corrAct.name, corrAct.note);
    if (res.variant === 'error') {
      setLoading(false);
      setMsgBox({ variant: res.variant, message: res.message });
    } else {
      setCorrAct({
        code: '',
        name: '',
        note: '',
      });
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        disabled={disabled}
        color="secondary"
        onClick={handleClickOpen}
      >
        Create Action
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
              Corrective Action
            </Typography>
          </Toolbar>
        </AppBar>
        
          <Box fontStyle="italic" fontWeight="fontWeightMedium" m={1}>
            Create New Action :
          </Box>
        <Paper className={classes.paper} elevation={2}>
          <Grid container spacing={2}>
            <Grid item xs={2} className={classes.labelDesign}>
              Code
            </Grid>
            <Grid item xs={3} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <TextField
                    id="code"
                    name="code"
                    variant="outlined"
                    disabled={disabled}
                    value={corrAct.code}
                    onChange={(event) => {
                      setCorrAct({
                        ...corrAct,
                        code: event.target.value,
                      });
                    }}
                    className={classes.textFieldColumn}
                    InputLabelProps={{
                      shrink: false,
                      readonly: true,
                    }}
                  />
                  <FormHelperText>
                    {!corrAct.code ? (
                      <div style={{ color: 'red' }}>Required</div>
                    ) : (
                      ''
                    )}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={2} className={classes.labelDesign}>
              <Typography variant='h6'>Name</Typography>
            </Grid>
            <Grid item xs={3} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <TextField
                    id="name"
                    name="name"
                    variant="outlined"
                    value={corrAct.name}
                    disabled={disabled}
                    onChange={(event) => {
                      setCorrAct({
                        ...corrAct,
                        name: event.target.value,
                      });
                    }}
                    className={classes.textFieldColumn}
                    InputLabelProps={{
                      shrink: false,
                      readonly: true,
                    }}
                  />
                  <FormHelperText>
                    {!corrAct.name ? (
                      <div style={{ color: 'red' }}>Required</div>
                    ) : (
                      ''
                    )}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2} className={classes.labelDesign}>
              <Typography variant='h6'>Note</Typography>
            </Grid>
            <Grid item xs={10} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item>
                  <TextareaAutosize
                    aria-label="Note"
                    rowsMin={5}
                    placeholder="Note"
                    disabled={disabled}
                    className={classes.textFieldColumn}
                    value={corrAct.note}
                    onChange={(event) => {
                      setCorrAct({
                        ...corrAct,
                        note: event.target.value,
                      });
                    }}
                  />
                  <FormHelperText>
                    {!corrAct.note ? (
                      <div style={{ color: 'red' }}>Required</div>
                    ) : (
                      ''
                    )}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={2} className={classes.labelDesign} />
              <Grid item>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                  disabled={disabled}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
    </div>
  );
};

export default CorrActDialog;

CorrActDialog.propTypes = {
  name: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
