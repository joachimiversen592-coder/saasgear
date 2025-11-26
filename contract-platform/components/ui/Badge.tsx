import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-apple-gray-100 text-apple-gray-700',
    success: 'bg-green-100 text-apple-green',
    warning: 'bg-orange-100 text-apple-orange',
    danger: 'bg-red-100 text-apple-red',
    info: 'bg-blue-100 text-apple-blue',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
