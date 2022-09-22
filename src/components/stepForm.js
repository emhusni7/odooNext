import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  textFieldTypeInput: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
    // marginTop: 5,
    // marginBottom: 5,
  },
}));

function getSteps() {
  return ['Pilih Customer', 'Pilih Item'];
}

const StepForm = ({
  setTitle,
  setMsgBox,
  setLoading,

  CustForm,
  DetailForm,
  ChangeCust,
  ChangeType,
  ChangeDate,
  Order,
  setOrderLine,
  delLine,
  createOrder,
  backReload,
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const steps = getSteps();

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CustForm
            setTitle={setTitle}
            changeCust={(value) => ChangeCust(value)}
            changeType={(value) => ChangeType(value)}
            changeDate={(value) => ChangeDate(value)}
            order={Order}
          />
        );
      case 1:
        return (
          <DetailForm
            setLoading={setLoading}
            setMsgBox={setMsgBox}
            order={Order}
            setOrderLine={(val) => setOrderLine(val)}
            delLine={(val) => delLine(val)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const totalSteps = () => {
    return getSteps().length;
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);
  };

  const handleNext = async () => {
    if (isLastStep()) {
      setLoading(true);
      const res = await createOrder();
      handleComplete();
      setLoading(false);
      if (!res.faultCode) {
        const newActiveStep =
          isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed
              // find the first step that has been completed
              steps.findIndex((step, i) => !completed.has(i))
            : activeStep + 1;

        setActiveStep(newActiveStep);
      } else {
        setMsgBox({ message: res.message, variant: 'error' });
      }
    } else if (!Order.customer_id || !Order.type_id || !Order.validity_date) {
      await setTimeout(
        setMsgBox({
          variant: 'error',
          message: 'field Customer, Type, Date Validity harus diisi',
        }),
        1000
      );
    } else {
      handleComplete();
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed
            // find the first step that has been completed
            steps.findIndex((step, i) => !completed.has(i))
          : activeStep + 1;

      setActiveStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          if (isStepOptional(index)) {
            buttonProps.optional = <Typography variant="caption" />;
          }

          return (
            <Step key={label} {...stepProps}>
              <StepButton
                onClick={handleStep(index)}
                completed={isStepComplete(index)}
                {...buttonProps}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button
              variant="contained"
              style={{ backgroundColor: '#808080', color: '#FFFFFF' }}
              onClick={() => backReload()}
            >
              Back
            </Button>
          </div>
        ) : (
          <>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ width: '100%' }}
            >
              <Grid item xs={12} md={12} sm={12}>
                {getStepContent(activeStep)}
              </Grid>
            </Grid>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '20vh', width: '100%' }}
            >
              <Grid style={{}} item xs={12} md={12} sm={12}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {isLastStep() ? 'Finish' : 'Next'}
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#808080', color: '#FFFFFF' }}
                  onClick={() => backReload()}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
};

export default StepForm;

StepForm.propTypes = {
  setTitle: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMsgBox: PropTypes.func.isRequired,
  CustForm: PropTypes.func.isRequired,
  DetailForm: PropTypes.func.isRequired,
  ChangeCust: PropTypes.func.isRequired,
  ChangeType: PropTypes.func.isRequired,
  ChangeDate: PropTypes.func.isRequired,
  Order: PropTypes.func.isRequired,
  setOrderLine: PropTypes.func.isRequired,
  delLine: PropTypes.func.isRequired,
  createOrder: PropTypes.func.isRequired,
  backReload: PropTypes.func.isRequired,
};
