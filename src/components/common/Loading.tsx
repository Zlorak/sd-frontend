import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <svg className="w-full h-full text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <div className={`${sizeClasses[size]} absolute top-0 left-0 animate-ping opacity-20`}>
          <div className="w-full h-full bg-primary-600 rounded-full"></div>
        </div>
      </div>
      {text && (
        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-400 font-medium">{text}</span>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="loading-dot-1"></div>
            <div className="loading-dot-2"></div>
            <div className="loading-dot-3"></div>
          </div>
        </div>
      )}
    </div>
  );
};