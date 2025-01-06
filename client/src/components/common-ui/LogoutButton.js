import React from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    router.push('/');
    console.log("Logut Sucessfully")
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}
