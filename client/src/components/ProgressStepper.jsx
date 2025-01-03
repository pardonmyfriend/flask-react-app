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
  const [canProceedToNextStep, setCanProceedToNextStep] = useState(false);
  const [completed, setCompleted] = useState({});
  const [columnTypesAligned, setColumnTypesAligned] = useState(true);
  const [file, setFile] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [data, setData] = useState(null);
  const [columnTypes, setColumnTypes] = useState(null);
  const [algorithmName, setAlgorithmName] = useState('');
  const [params, setParams] = useState({});
  const [algorithmSelected, setAlgorithmSelected] = useState(false);
  const [target, setTarget] = useState(null); //do zmiany
  const [algTab, setAlgTab] = useState(0);
  const [dataTab, setDataTab] = useState(0);

  const totalSteps = steps.length;
  const completedSteps = Object.keys(completed).length;
  const allStepsCompleted = completedSteps === totalSteps;

  const handleProceed = (canProceed) => {
    setCanProceedToNextStep(canProceed);
  };

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
    //setActiveStepFulfilled(0);
    setCanProceedToNextStep(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({})
  };

  return (
    <Box sx={{ width: '100%' }}>
        <Stepper 
          activeStep={activeStep}
          sx={{ marginBottom: '30px' }}
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
          <Box
            sx={{
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#fff',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1), 0px 8px 30px rgba(0, 0, 0, 0.15)',
              width: '80%',
              margin: '0 auto',
              maxWidth: '1200px',
              minHeight: 'calc(100vh - 204px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {React.cloneElement(stepContent[activeStep], { 
              file: file,
              setFile: setFile,
              selectedDataset: selectedDataset,
              setSelectedDataset: setSelectedDataset,
              data: data, 
              setData: setData, 
              algorithmName: algorithmName, 
              setAlgorithmName: setAlgorithmName, 
              params: params, 
              setParams: setParams,
              algorithmSelected: algorithmSelected,
              setAlgorithmSelected: setAlgorithmSelected,
              onProceed: handleProceed, 
              columnTypes: columnTypes, 
              setColumnTypes: setColumnTypes,
              algTab: algTab,
              setAlgTab: setAlgTab,
              dataTab: dataTab,
              setDataTab: setDataTab,
              target: target,
              setTarget: setTarget,
              columnTypesAligned: columnTypesAligned,
              setColumnTypesAligned: setColumnTypesAligned
            })
            }
          </Box>
          <Fab 
            color="primary" 
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowBackIcon />
          </Fab>

          <Fab 
            color="primary" 
            onClick={handleNext}
            //disabled={activeStep === totalSteps - 1}
            disabled={!canProceedToNextStep}
            sx={{
              position: 'fixed',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowForwardIcon />
          </Fab>
        </div>
      </Box>
  )
}

export default ProgressStepper