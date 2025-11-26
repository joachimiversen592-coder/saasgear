import React from 'react';
import { SFSymbol, SFSymbolName } from '../icons/SFSymbol';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: SFSymbolName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-apple-blue text-white hover:bg-blue-600 active:scale-[0.98] shadow-apple',
    secondary: 'bg-apple-gray-100 text-apple-gray-900 hover:bg-apple-gray-200 active:scale-[0.98]',
    ghost: 'text-apple-gray-700 hover:bg-apple-gray-100 active:bg-apple-gray-200',
    danger: 'bg-apple-red text-white hover:bg-red-600 active:scale-[0.98] shadow-apple',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-apple',
    md: 'px-4 py-2.5 text-base rounded-apple',
    lg: 'px-6 py-3 text-lg rounded-apple-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <SFSymbol name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
          {children}
          {icon && iconPosition === 'right' && <SFSymbol name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
        </>
      )}
    </button>
  );
};
