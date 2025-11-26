'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SFSymbol, SFSymbolName } from '../icons/SFSymbol';

interface NavItem {
  name: string;
  href: string;
  icon: SFSymbolName;
}

interface SidebarProps {
  role: 'startup' | 'lawyer' | 'enterprise_admin';
}

const startupNav: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: 'square.grid' },
  { name: 'Contracts', href: '/dashboard/contracts', icon: 'doc.text' },
  { name: 'Settings', href: '/dashboard/settings', icon: 'gear' },
];

const lawyerNav: NavItem[] = [
  { name: 'Dashboard', href: '/lawyer', icon: 'square.grid' },
  { name: 'Review Queue', href: '/lawyer/queue', icon: 'doc.text' },
  { name: 'Completed', href: '/lawyer/completed', icon: 'checkmark.circle' },
  { name: 'Earnings', href: '/lawyer/earnings', icon: 'star' },
];

const enterpriseNav: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: 'square.grid' },
  { name: 'Contracts', href: '/admin/contracts', icon: 'doc.text' },
  { name: 'Team', href: '/admin/team', icon: 'person.2' },
  { name: 'Audit Logs', href: '/admin/audit', icon: 'clock' },
  { name: 'Settings', href: '/admin/settings', icon: 'gear' },
];

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();

  const navItems = role === 'lawyer' ? lawyerNav : role === 'enterprise_admin' ? enterpriseNav : startupNav;

  return (
    <aside className="w-64 bg-white border-r border-apple-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-apple-gray-200">
        <Link href="/dashboard">
          <h1 className="text-2xl font-semibold text-apple-gray-900">ContractOS</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-apple transition-all ${
                isActive
                  ? 'bg-apple-gray-100 text-apple-blue font-medium'
                  : 'text-apple-gray-700 hover:bg-apple-gray-50'
              }`}
            >
              <SFSymbol
                name={item.icon}
                size={20}
                weight={isActive ? 'semibold' : 'regular'}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-apple-gray-200">
        <Link
          href="/auth/signin"
          className="flex items-center gap-3 px-4 py-2.5 rounded-apple text-apple-gray-700 hover:bg-apple-gray-50 transition-all"
        >
          <SFSymbol name="arrow.left" size={20} />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
};
