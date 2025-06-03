import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function LoadingButton({ 
  isLoading, 
  children, 
  variant = 'primary',
  className = '',
  disabled,
  ...props 
}: LoadingButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 rounded-lg transition-colors disabled:opacity-50";
  const variantStyles = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700" 
    : "bg-gray-100 text-gray-700 hover:bg-gray-200";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}