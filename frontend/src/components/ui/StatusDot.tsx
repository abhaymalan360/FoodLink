interface StatusDotProps {
  status: 'available' | 'matched' | 'expired';
}

export default function StatusDot({ status }: StatusDotProps) {
  const getColors = () => {
    switch (status) {
      case 'available': return { dot: 'bg-green-500', pulse: 'bg-green-500', animate: true };
      case 'matched': return { dot: 'bg-amber-500', pulse: 'bg-amber-500', animate: true };
      case 'expired': return { dot: 'bg-slate-300', pulse: '', animate: false };
      default: return { dot: 'bg-slate-300', pulse: '', animate: false };
    }
  };

  const { dot, pulse, animate } = getColors();

  return (
    <div className="relative flex h-2 w-2 items-center justify-center mr-2">
      {animate && (
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${pulse}`}></span>
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`}></span>
    </div>
  );
}
