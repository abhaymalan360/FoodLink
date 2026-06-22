export default function Skeleton({ className = '', variant = 'row' }: { className?: string, variant?: 'card' | 'row' | 'stat' | 'graph' }) {
  let baseClass = "bg-surface-container-high animate-shimmer relative overflow-hidden";
  
  if (variant === 'card') baseClass += " rounded-xl h-32 w-full";
  if (variant === 'row') baseClass += " rounded-lg h-16 w-full";
  if (variant === 'stat') baseClass += " rounded-lg h-24 w-full";
  if (variant === 'graph') baseClass += " rounded-xl h-64 w-full";

  return (
    <div className={`${baseClass} ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  );
}
