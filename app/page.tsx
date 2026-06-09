'use client';

import { useEffect, useState, useRef } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Navigation } from '@/components/Navigation';
import { Toolbar } from '@/components/Toolbar';
import { PersonList } from '@/components/PersonList';
import { AddPersonDialog } from '@/components/AddPersonDialog';
import { PaymentDialog } from '@/components/PaymentDialog';
import { InfoView } from '@/components/InfoView';
import { ExportImportMenu } from '@/components/ExportImportMenu';

// Force client-side only rendering - no SSR
export const dynamic = 'force-dynamic';

/**
 * Inner App Component with flip animation
 */
function AppContent() {
  const { infoViewOpen } = useApp();
  const appContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appContainerRef.current) {
      // Don't add flipping class when InfoView is open to prevent mirror effect
      // The flip animation was blocking scrolling functionality
      if (!infoViewOpen) {
        appContainerRef.current.classList.remove('flipping');
      }
    }
  }, [infoViewOpen]);

  return (
    <>
      <div className="flip-container" ref={appContainerRef}>
        <div className="app-container">
          {/* Navigation Bar */}
          <Navigation />

          {/* Main Content Area */}
          <div className="content">
            <PersonList />
          </div>

          {/* Toolbar */}
          <Toolbar />

          {/* Actions Menu - inside app container */}
          <ExportImportMenu />
        </div>

        {/* InfoView - on the back of the card */}
        <InfoView />
      </div>

      {/* Modals and Overlays */}
      <AddPersonDialog />
      <PaymentDialog />
    </>
  );
}

/**
 * PayCoffee Main Application
 * Web replica of the classic iOS PayCoffee app
 */
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted on client to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
