import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <input
        ref={ref}
        className={`w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none ${error ? 'border-red-400' : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <select
        className={`w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-amber-600' : 'bg-stone-300'}`} />
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <span className="text-sm text-stone-700">{label}</span>
    </label>
  );
}
