'use client'; // Mark the component as a client component

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TableSortLabel, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import Pagination from '../common-ui/Pagination';
import { setLoading, setApplications } from '../../redux/slices/ShortlistedSlice';
import ShortlistedView from './ShortlistedView';

const Shortlisted = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.shortlisted);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('fullName');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const itemsPerPage = 10;

  // Get the token (assuming it's saved in localStorage)
  const token = localStorage.getItem('token');

  const handleViewClick = (application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedApplication(null);
  };

  // Fetch shortlisted applicants from the API
  useEffect(() => {
    const fetchApplicationData = async () => {
      dispatch(setLoading(true)); // Start loading
      try {
        // Make the API call with the token in the Authorization header
        const res = await axios.get('http://localhost:8080/api/hrms/getshortlistedapplicantdetails', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the headers
          },
        });

        const data = res.data;
        console.log('Fetched applications:', data);

        dispatch(setApplications(data)); // Set applications in Redux store
      } catch (error) {
        console.error('Error fetching application data:', error);
      } finally {
        dispatch(setLoading(false)); // Stop loading
      }
    };

    fetchApplicationData(); // Call the function to fetch data
  }, [dispatch, token]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort the applications based on the selected column (e.g., 'applicationId' or 'fullName')
  const sortedApplications = [...applications].sort((a, b) => {
    if (orderBy === 'applicantId') {
      return order === 'asc' ? a.applicantId - b.applicantId : b.applicantId - a.applicantId;
    } else if (orderBy === 'fullName') {
      const nameA = a.fullName || '';
      const nameB = b.fullName || '';
      return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    return 0;
  });

  // Paginate the applications
  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <Typography className="text-xl text-center py-10">Loading...</Typography>;

  return (
    <Box sx={{ padding: 2, backgroundColor: 'white', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Shortlisted List
      </Typography>

      <TableContainer sx={{ width: '100%', maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'applicantId'}
                  direction={orderBy === 'applicantId' ? order : 'asc'}
                  onClick={() => handleRequestSort('applicantId')}
                >
                  <strong>ApplicationId</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'fullName'}
                  direction={orderBy === 'fullName' ? order : 'asc'}
                  onClick={() => handleRequestSort('fullName')}
                >
                  <strong>Name</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedApplications.map((application) => (
              <TableRow key={application.applicantId}>
                <TableCell>{application.applicantId}</TableCell>
                <TableCell>{application.fullName}</TableCell>
                <TableCell>{application.gender}</TableCell>
                <TableCell>{application.role}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>
                  <VisibilityIcon
                    color="primary"
                    cursor="pointer"
                    onClick={() => handleViewClick(application)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {paginatedApplications.length > 0 && (
        <Pagination
          totalItems={applications.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="85vw">
        <DialogContent>
          <IconButton edge="end" color="inherit" onClick={handleModalClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          {selectedApplication && <ShortlistedView application={selectedApplication} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Shortlisted;
