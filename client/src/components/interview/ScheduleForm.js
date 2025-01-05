'use client';
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, Button, Box } from '@mui/material';
import axios from 'axios';  // Importing Axios

const ScheduleForm = ({ application, onSubmit, onCancel }) => {
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMode, setInterviewMode] = useState(''); // State for interview mode
  const [selectedRound, setSelectedRound] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [generateEmailInterviewer, setGenerateEmailInterviewer] = useState(false);
  const [generateEmailApplicant, setGenerateEmailApplicant] = useState(false);
  const [roundInterviewers, setRoundInterviewers] = useState([]);

  // Hardcoded interview rounds and interviewers
  const interviewersData = [
    {
      roundName: 'Technical Round',
      interviewers: ['John Doe', 'Jane Smith', 'Alice Johnson'],
    },
    {
      roundName: 'HR Round',
      interviewers: ['Robert Brown', 'Emily White', 'Sarah Lee'],
    },
    {
      roundName: 'Management Round',
      interviewers: ['Michael Davis', 'Sophia Clark', 'James Walker'],
    },
  ];

  // Dynamic fetching of interviewers based on round selection
  const handleRoundChange = (event) => {
    const selectedRound = event.target.value;
    setSelectedRound(selectedRound);

    // Find interviewers for the selected round
    const roundData = interviewersData.find((round) => round.roundName === selectedRound);
    if (roundData) {
      setRoundInterviewers(roundData.interviewers);
    } else {
      setRoundInterviewers([]);
    }
  };

  const validateForm = () => {
    return interviewDate && interviewTime && interviewMode && selectedRound && selectedInterviewer;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      applicationId: application.applicationId,  // Use the applicationId from the passed prop
      fullName: application.fullName,  // Applicant's name
      role: application.role,  // Job role
      interviewDate,
      interviewTime,
      interviewMode,
      roundName: selectedRound,  // Round name (e.g., Technical Round)
      interviewerName: selectedInterviewer,  // Interviewer's name
      generateEmailCandidate: generateEmailApplicant,  // Whether to send email to applicant
      generateEmailInterviewer,  // Whether to send email to interviewer
    };

    console.log('Scheduling Interview:', formData);

    try {
      // Make the POST request using Axios
      const response = await axios.post('http://localhost:5000/api/hrms/saveInterviewschedule', formData);

      // Check if the response is successful (status code 200)
      if (response.status === 200) {
        console.log('Interview scheduled successfully');
        // Pass the form data to the parent onSubmit handler
        onSubmit(formData);
      } else {
        console.log('Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  return (
    <Box className="space-y-4">
      <TextField label="Application ID" value={application.applicationId} fullWidth disabled className="bg-gray-100" />
      <TextField label="Applicant Name" value={application.fullName} fullWidth disabled className="bg-gray-100" />
      <TextField label="Job Role" value={application.role} fullWidth disabled className="bg-gray-100" />
      <TextField label="Interview Date" type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
      <TextField label="Interview Time" type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />

      {/* Interview Mode Dropdown */}
      <FormControl fullWidth>
        <InputLabel>Interview Mode</InputLabel>
        <Select value={interviewMode} onChange={(e) => setInterviewMode(e.target.value)}>
          <MenuItem value="In-person">In-person</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
        </Select>
      </FormControl>

      {/* Round Name Dropdown */}
      <FormControl fullWidth>
        <InputLabel>Round Name</InputLabel>
        <Select value={selectedRound} onChange={handleRoundChange}>
          {interviewersData.map((round, index) => (
            <MenuItem key={index} value={round.roundName}>
              {round.roundName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Interviewer Name Dropdown */}
      <FormControl fullWidth>
        <InputLabel>Interviewer</InputLabel>
        <Select value={selectedInterviewer} onChange={(e) => setSelectedInterviewer(e.target.value)}>
          {roundInterviewers.map((interviewer, index) => (
            <MenuItem key={index} value={interviewer}>
              {interviewer}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Generate Email to Interviewer Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={generateEmailInterviewer}
            onChange={(e) => setGenerateEmailInterviewer(e.target.checked)}
          />
        }
        label="Generate Email to Interviewer"
      />

      {/* Generate Email to Applicant Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={generateEmailApplicant}
            onChange={(e) => setGenerateEmailApplicant(e.target.checked)}
          />
        }
        label="Generate Email to Applicant"
      />

      {/* Submit and Cancel buttons */}
      <Box className="flex justify-center gap-4">
        <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
          Schedule Interview
        </Button>
        <Button onClick={onCancel} variant="outlined" color="secondary" fullWidth>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ScheduleForm;
