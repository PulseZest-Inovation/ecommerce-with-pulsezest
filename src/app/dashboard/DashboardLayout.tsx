'use client';

import { AuthProvider } from '@/context/AuthContext';
import { RouterProvider } from '@/context/RouterContext';

export default function DashboardLayout({ Component, pageProps }: any) {
  return (
    <AuthProvider>
      <RouterProvider>
        <Component {...pageProps} />
      </RouterProvider>
    </AuthProvider>
  );
}
