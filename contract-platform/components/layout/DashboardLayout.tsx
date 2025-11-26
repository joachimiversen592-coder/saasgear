'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'startup' | 'lawyer' | 'enterprise_admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  return (
    <div className="flex min-h-screen bg-apple-gray-50">
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
