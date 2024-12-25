'use client'
import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RouterContextProps {
  currentRoute: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextProps>({
  currentRoute: '/',
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const router = useRouter();

  const navigate = (path: string) => {
    setCurrentRoute(path);
    router.push(path);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouterContext = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouterContext must be used within a RouterProvider');
  }
  return context;
};



// import React from 'react';
// import { useRouterContext } from '@/context/RouterContext';

// const NavigationButtons: React.FC = () => {
//   const { navigate } = useRouterContext();

//   return (
//     <div>
//       <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
//       <button onClick={() => navigate('/profile')}>Go to Profile</button>
//     </div>
//   );
// };

// export default NavigationButtons;
