import React, { useState, useEffect } from 'react';
import { Box, Grid, TableCell, TableBody, TableRow, TableContainer, Table, TableHead, Typography, Button, Modal } from '@mui/material';
import axios from 'axios';
import ScheduleForm from '../interview/ScheduleForm';
import DownloadIcon from '@mui/icons-material/Download';

const ShortlistedView = ({ application }) => {
  const [resultData, setResultData] = useState([]);
  const [openScheduleForm, setOpenScheduleForm] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:5000/result');
        setResultData(response.data); // Store the result data from API
      } catch (error) {
        console.error('Error fetching result data:', error);
      }
    };

    fetchResults(); // Fetch the result data when component mounts
  }, []); 

  const handleScheduleButtonClick = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setOpenScheduleForm(true);
  };

  const handleFormCancel = () => {
    setOpenScheduleForm(false);
    setSelectedApplicationId(null);
  };

  const handleFormSubmit = (formData) => {
    console.log('Scheduled Interview:', formData);
    setOpenScheduleForm(false);
  };

  // Labels for the fields (hardcoded)
  const labels = {
    applicationId: 'Application ID',
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth',
    address: 'Address',
    gender: 'Gender',
    email: 'Email',
    contact: 'Contact',
    role: 'Role',
    yearOfExperience: 'Years of Experience',
    passoutYear: 'Passout Year',
    highestQualification: 'Highest Qualification',
    skills: 'Skills',
  };

  return (
    <Box sx={{ padding: 2,  width: '100%' }}>
      <Grid container spacing={2}>
        {/* Left side (Profile Info) */}
        <Grid item xs={12} sm={6}>
          {Object.keys(labels).slice(0, 7).map((key, index) => (
            <Box key={index} display="flex" alignItems="center" marginBottom="8px">
              <Typography variant="body2" fontWeight="bold" sx={{ marginRight: '10px' }}>
                {labels[key]}:
              </Typography>
              {/* Check if the key exists in application object */}
              <Typography variant="body2">{application[key] || 'Not available'}</Typography>
            </Box>
          ))}
        </Grid>

        {/* Right side (Additional Info) */}
        <Grid item xs={12} sm={6}>
          {Object.keys(labels).slice(7).map((key, index) => (
            <Box key={index} display="flex" alignItems="center" marginBottom="8px">
              <Typography variant="body2" fontWeight="bold" sx={{ marginRight: '10px' }}>
                {labels[key]}:
              </Typography>
              <Typography variant="body2">
                {/* If it's an array (e.g., skills), join with commas, otherwise show the value */}
                {Array.isArray(application[key]) ? application[key].join(', ') : application[key] || 'Not available'}
              </Typography>
            </Box>
          ))}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.open(application.uploadYourResume, '_blank')} 
            sx={{ marginTop: '10px', fontSize: '12px' }} 
            startIcon={<DownloadIcon />}  // Add the Download Icon
          >
            Resume
          </Button>
        </Grid>

      </Grid>

      <TableContainer sx={{
        marginTop: '20px',
        overflowX: 'auto', // Allow horizontal scrolling
        '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Round Name</strong></TableCell>
              <TableCell><strong>Feedback</strong></TableCell>
              <TableCell><strong>Result</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Interview Time</strong></TableCell>
              <TableCell><strong>Interviewer Name</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultData.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.roundName}</TableCell>
                <TableCell>{result.feedback || 'No feedback provided'}</TableCell>
                <TableCell>{result.result || 'Not available'}</TableCell>
                <TableCell>{result.date}</TableCell>
                <TableCell>{result.interviewTime || 'Not scheduled'}</TableCell>
                <TableCell>{result.interviewerName || 'Not assigned'}</TableCell>
                <TableCell>
                  {result.status !== 'completed' ? (
                    <Button
                    variant="outlined"
                    sx={{
                      backgroundColor: 'primary.main',  // Set the background color to primary
                      color: 'white',  // Text color to white
                      '&:hover': {
                        backgroundColor: 'primary.dark', // Set the hover background to primary dark for effect
                      },
                    }}
                    onClick={() => handleScheduleButtonClick(result.applicationId)}
                  >
                    Schedule
                  </Button>
                  ) : (
                    <Button variant="outlined" color="primary" disabled>
                      Completed
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openScheduleForm}
        onClose={handleFormCancel}
        aria-labelledby="schedule-modal-title"
        aria-describedby="schedule-modal-description"
      >
        <Box sx={{
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          backgroundColor: 'white', 
          padding: 2, 
          boxShadow: 24, 
          width: '90%', 
          maxWidth: 600,
        }}>
          <ScheduleForm application={application} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ShortlistedView;
