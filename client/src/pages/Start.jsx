import React from 'react';
import { Divider, List, ListItem, ListItemText, ListItemIcon, Box, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StartPage = ({ onClick }) => {
  return (
    <div
      className="start-page"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        // background: 'linear-gradient(135deg, #3FBDBD, #2D91A3)',
        color: '#ffffff',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #3FBDBD, #2D91A3)',
          borderRadius: '16px',
          padding: '30px',
          width: '80%',
        //   maxWidth: '800px',
        //   boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Data Analysis & Exploration
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
          Welcome to an application designed to simplify data analysis and exploration. Whether
          you're working with your own datasets or experimenting with built-in examples, this tool
          provides an intuitive, step-by-step interface to turn raw data into meaningful insights.
        </Typography>
        <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
        {/* <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Features
        </Typography> */}
        <List sx={{ color: 'white' }}>
          {[
            "Upload your data or choose from sample datasets.",
            "Perform data preprocessing and generate basic statistics.",
            "Apply advanced algorithms for dimensionality reduction, clustering and classification.",
            "Explore results through interactive visualizations and export them for further use."
          ].map((text, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon>
                <StarIcon sx={{ color: '#FFD700' }} />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: 'white',
            color: '#3FBDBD',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#FFD700',
            },
          }}
        >
          Get started!
        </Button>
      </Box>
    </div>
  );
};

export default StartPage;
