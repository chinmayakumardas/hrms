'use client'
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

  const handleViewClick = (application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedApplication(null);
  };

  useEffect(() => {
    const fetchApplicationData = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8080/api/hrms/getshortlistedapplicantdetails', {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in the Authorization header
      },
    });
        const data = res.data;
        console.log(data)
        dispatch(setApplications(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.error('Error fetching application data:', error);
        dispatch(setLoading(false));
      }
    };

    fetchApplicationData();
  }, [dispatch]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedApplications = [...applications].sort((a, b) => {
    if (orderBy === 'applicationId') {
      return order === 'asc' ? a.applicationId - b.applicationId : b.applicationId - a.applicationId;
    } else if (orderBy === 'fullName') {
      const nameA = a.fullName || '';
      const nameB = b.fullName || '';
      return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    return 0;
  });

  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <Typography className="text-xl text-center py-10">Loading...</Typography>;

  return (
    <Box sx={{ padding: 2, backgroundColor: 'white',width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Shortlisted List
      </Typography>

      <TableContainer sx={{ width: '100%', maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={orderBy === 'applicationId'} direction={orderBy === 'applicationId' ? order : 'asc'} onClick={() => handleRequestSort('applicationId')}>
                  <strong>ApplicationId</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={orderBy === 'fullName'} direction={orderBy === 'fullName' ? order : 'asc'} onClick={() => handleRequestSort('fullName')}>
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
              <TableRow key={application.applicationId}>
                <TableCell>{application.applicationId}</TableCell>
                <TableCell>{application.fullName}</TableCell>
                <TableCell>{application.gender}</TableCell>
                <TableCell>{application.role}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>
                         <VisibilityIcon color="primary" cursor='pointer' onClick={() => handleViewClick(application)}/>
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

      <Dialog open={modalOpen} onClose={handleModalClose}  fullWidth maxWidth="85vw">
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
