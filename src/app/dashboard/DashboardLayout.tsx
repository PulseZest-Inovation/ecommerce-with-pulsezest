'use client';

import { AuthProvider } from '@/context/AuthContext';
import { RouterProvider } from '@/context/RouterContext';

export default function DashboardLayout({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <RouterProvider>
        <Component {...pageProps} />
        <h1>hello</h1>
      </RouterProvider>
    </AuthProvider>
  );
}
