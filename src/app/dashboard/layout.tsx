'use client'
import React from 'react';
import DashboardWrapper from '@/services/DashboardWrapper'

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
   <div>
    {/* <h1>hello</h1> */}
    <DashboardWrapper/>
    {/* {children} */}
   </div>
  );
}
