
// api/api.js

import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000/'
  baseURL: 'http://localhost:8080/api/hrms', // New base URL for the API

});

export const getApplications = async () => {
  const res = await axiosInstance.get('/getshortlistedapplicantdetails'); // New endpoint
  return res.data;
  console.log(res.data)
};

export const setApplications = async () => {
  const res = await axiosInstance.get('/getshortlistedapplicantdetails'); // New endpoint
  console.log(res)
  return res.data;
};

