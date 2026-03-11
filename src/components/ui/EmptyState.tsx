import type { ReactNode } from 'react';

export default function EmptyState({ icon, title, description, action }: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
