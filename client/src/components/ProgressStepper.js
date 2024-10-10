import React, { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Button, Typography, Box } from '@mui/material';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function ProgressStepper({ steps, stepContent }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = steps.length;
  const completedSteps = Object.keys(completed).length;
  const allStepsCompleted = completedSteps === totalSteps;

  const handleBack = () => {
    const newCompleted = { ...completed };
    delete newCompleted[activeStep - 1];
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted)
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({})
  };

  return (
    <Box sx={{ width: '100%' }}>
        <Stepper 
          activeStep={activeStep}
        >
            {steps.map((step, index) => (
                <Step 
                  key={step}
                  completed={completed[index]}
                >
                    <StepLabel>{step}</StepLabel>
                </Step>
            ))}
        </Stepper>
        <div>
          {allStepsCompleted ?
          (
            <>
              <Typography 
                sx={{ mt: 2, mb: 1}}
              >
                All steps completed
              </Typography>
              <Box
                sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}
              >
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  variant='contained'
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  borderRadius: '20px',
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1), 0px 8px 30px rgba(0, 0, 0, 0.15)', // Efekt 3D cienia
                  width: '70%',
                  margin: '30px auto',
                  maxWidth: '1200px',
                  minHeight: '150vh'
                }}
              >
                {stepContent[activeStep]}
              </Box>
              <Fab 
                color="primary" 
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  position: 'fixed',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <ArrowBackIcon />
              </Fab>

              <Fab 
                color="primary" 
                onClick={handleNext}
                disabled={activeStep === totalSteps - 1}
                sx={{
                  position: 'fixed',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <ArrowForwardIcon />
              </Fab>
            </>
          )
          }
        </div>
    </Box>
  )
}

export default ProgressStepper