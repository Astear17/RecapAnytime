'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/recap/demo');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-xs text-muted">
      Initializing demo mode simulation...
    </div>
  );
}
