'use client';

import { useEffect, useState } from 'react';

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setDateStr(new Date().toLocaleDateString('en-US', options));
    
    // Add small delay for fade-in effect
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-2xl font-semibold tracking-tight text-on-surface">
        {greeting}, {name}
      </h1>
      <p className="text-[13px] font-medium text-on-surface-variant mt-0.5">
        {dateStr}
      </p>
    </div>
  );
}
