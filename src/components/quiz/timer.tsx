"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TimerIcon } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
}

export function Timer({ initialMinutes, onTimeUp }: TimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const isLowTime = seconds <= 60;

  return (
    <Card className={`flex items-center gap-2 p-2 px-3 shadow-md transition-colors ${isLowTime ? 'bg-accent text-accent-foreground' : 'bg-card'}`}>
      <TimerIcon className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
      <span className="text-lg font-semibold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
      </span>
    </Card>
  );
}
