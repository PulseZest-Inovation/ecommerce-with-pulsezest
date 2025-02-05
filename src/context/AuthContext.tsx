'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firbeaseConfig';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false); // Stop loading when user is found
      } else {
        setUser(null);
        setLoading(false); // Stop loading even when no user is found
        router.push('/login'); // Redirect if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



// import React from 'react';
// import { useAuth } from '@/context/AuthContext';

// const UserProfile: React.FC = () => {
//   const { isAuthenticated, user, loading } = useAuth();

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!isAuthenticated) {
//     return <p>You are not logged in.</p>;
//   }

//   return (
//     <div>
//       <h1>Welcome, {user.displayName || 'User'}!</h1>
//       <p>Email: {user.email}</p>
//     </div>
//   );
// };

// export default UserProfile;
