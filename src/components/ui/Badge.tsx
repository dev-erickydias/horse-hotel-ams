import type { ReactNode } from 'react';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

const variants: Record<Variant, string> = {
  default: 'bg-cream-200 text-stone-600 border-cream-300',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
  danger: 'bg-red-50 text-red-700 border-red-200/80',
  info: 'bg-sky-50 text-sky-700 border-sky-200/80',
  purple: 'bg-violet-50 text-violet-700 border-violet-200/80',
};

export default function Badge({ children, variant = 'default', className = '' }: { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
