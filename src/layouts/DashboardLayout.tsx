/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from '@/components/header/HeaderLayout';
import Sidebar from '@/components/sidebar/SidebarLayout';
import 'material-icons/iconfont/material-icons.css';
import React, { useState } from 'react';

interface DashboardProps {
  children: React.ReactNode | ((data: any) => void);
}

const DashboardLayout: React.FC<DashboardProps> = ({ children }) => {
  const [activeSection, _setActiveSection] = useState('');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const onToggleSidebar = (collapsedState: boolean) => {
    setIsSidebarCollapsed(collapsedState);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Sidebar onToggleSidebar={onToggleSidebar} />

      <Header />

      <div
        className={`flex-1 overflow-auto transition-all duration-300
          ${
            isSidebarCollapsed
              ? 'md:pl-21 min-[1640px]:pl-0'
              : 'md:pl-65 min-[1940px]:pl-0'
          } pt-4 md:pr-0`}
      >
        <main className="p-2 rounded-lg mt-18">
          {typeof children === 'function'
            ? (children({ activeSection }) as React.ReactNode) || null
            : React.isValidElement(children)
            ? children
            : null}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
