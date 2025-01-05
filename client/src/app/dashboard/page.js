'use client'; // Mark the component as a client component

import React from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import LogoutButton from '@/components/common-ui/LogoutButton';

const Page = () => {
  const router = useRouter();

 

  return (
    <div>
      <h1>Dashboard</h1>
      <a href="/shortlisted-list">SHORLISTEDPAGE</a> 
      
      {/* Display a logout button */}
      <LogoutButton/>
    </div>
  );
};

export default Page;
