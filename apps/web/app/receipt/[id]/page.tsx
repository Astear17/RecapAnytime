'use client';

import { Suspense } from 'react';
import ReceiptPageContent from './ReceiptContent';

export default function ReceiptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen hero-mesh">
          <div className="w-10 h-10 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
        </div>
      }
    >
      <ReceiptPageContent />
    </Suspense>
  );
}
