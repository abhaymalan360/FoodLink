import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  subtext: string;
  className?: string;
}

export default function EmptyState({ icon: Icon, heading, subtext, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Icon className="w-8 h-8 text-outline-variant mb-3" strokeWidth={1} />
      <h3 className="text-[14px] font-medium text-on-surface-variant mb-1">{heading}</h3>
      <p className="text-[12px] text-on-surface-variant max-w-[250px] mx-auto">{subtext}</p>
    </div>
  );
}
