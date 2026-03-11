import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-amber-700 hover:bg-amber-800 text-white shadow-sm',
  secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200',
  ghost: 'hover:bg-stone-100 text-stone-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({ variant = 'primary', size = 'md', children, icon, className = '', ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
