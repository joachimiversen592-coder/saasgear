import React from 'react';
import { SFSymbol, SFSymbolName } from '../icons/SFSymbol';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: SFSymbolName;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-apple-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-400">
            <SFSymbol name={icon} size={18} />
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 bg-apple-gray-50 border ${
            error ? 'border-apple-red' : 'border-apple-gray-200'
          } rounded-apple text-apple-gray-900 placeholder:text-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all ${
            icon && iconPosition === 'left' ? 'pl-10' : ''
          } ${icon && iconPosition === 'right' ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray-400">
            <SFSymbol name={icon} size={18} />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-apple-red">{error}</p>
      )}
    </div>
  );
};
