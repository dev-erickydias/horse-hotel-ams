import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-stone-200/60 shadow-sm
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 border-b border-stone-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}
