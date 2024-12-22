import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
   <div>
    {/* <h1>hello</h1> */}
    {children}
   </div>
  );
}
