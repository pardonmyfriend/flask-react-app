import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function DataDescription({ title, description, children }) {
    return (
        <Accordion defaultExpanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    {description}
                </Typography>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

export default DataDescription;