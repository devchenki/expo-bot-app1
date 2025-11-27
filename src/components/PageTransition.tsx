import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}
      style={{
        animation: 'fadeInUp 0.3s ease-out',
      }}
    >
      {children}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
