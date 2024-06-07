import React, { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="app-container flex">
      <Sidebar />
      <main className="content flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
