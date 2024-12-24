import React, { useState } from 'react';
import { Button, Tooltip, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

const Tile = ({ title, info, onClick, algorithmName, setAlgorithmName, params, setParams, algorithmSelected, setAlgorithmSelected }) => {
  const [expanded, setExpanded] = useState(false);

  const selected = algorithmSelected && algorithmName && algorithmName === title;

  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const handleDeselectAlgorithm = () => {
    setAlgorithmName('')
    setParams({})
    setAlgorithmSelected(false);
  };

  return (
    <div>
      <Button
        onClick={onClick}
        variant={selected ? 'contained' : 'outlined'}
        disabled={algorithmSelected && !selected}
        sx={{
          width: 200,
          height: 200,
          borderColor: '#3FBDBD',
          color: selected ? '#fff' : 'black',
          backgroundColor: selected ? '#3FBDBD' : 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          boxShadow: 3,
          margin: 1,
          position: 'relative',
          textTransform: 'none',
          '&:hover': {
            boxShadow: 5,
            borderWidth: 3,
          },
        }}
      >
        {title}

        {!selected && (
          <Tooltip
            title={
              <div>
                <strong style={{ color: '#3FBDBD' }}>{info.name}</strong> <br />
                {info.description}
              </div>
            } 
            arrow
          >
            <span
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                color: algorithmSelected ? '#D7D7D7' : '#3FBDBD',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <InfoIcon />
            </span>
          </Tooltip>
        )}

        {selected && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: '#fff',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <CheckIcon />
          </span>
        )}
      </Button>

      {selected && (
        <Accordion expanded={expanded} onChange={handleAccordionChange} sx={{ 
          width: 200,
          marginTop: 0,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          border: 'none',
        }}>
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon sx={{ 
                fontSize: 30,
                color: '#3FBDBD',
              }} />
            }
            sx={{
              paddingRight: 0,
            }}
          >
            <Typography sx={{ fontSize: 14 }}>Params</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingRight: 0, textAlign: 'left' }}>
          <Typography sx={{ fontSize: 14 }}>
              {params && Object.keys(params).map((paramName) => (
                <span key={paramName}>
                  {paramName}: { 
                    typeof params[paramName] === 'boolean' 
                      ? (params[paramName] ? 'true' : 'false')
                      : params[paramName]
                  }
                  <br />
                </span>
              ))}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {selected && (
        <div style={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleDeselectAlgorithm}
            sx={{
              width: 200,
              fontSize: 12,  // Zmniejszenie rozmiaru tekstu
              whiteSpace: 'normal',  // Tekst może przełamać się na dwie linie
              wordBreak: 'break-word',  // Złamanie słów, aby pasowały do szerokości
            }}
          >
            Select another algorithm
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tile;
