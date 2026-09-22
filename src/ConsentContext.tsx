import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConsentRequirement } from './types';

interface ConsentContextType {
  requestConsent: (requirement: ConsentRequirement) => Promise<boolean>;
  isConsentOpen: boolean;
  activeRequirement: ConsentRequirement | null;
  closeConsent: () => void;
  confirmConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [activeRequirement, setActiveRequirement] = useState<ConsentRequirement | null>(null);
  const [resolveCallback, setResolveCallback] = useState<((val: boolean) => void) | null>(null);

  const requestConsent = (requirement: ConsentRequirement): Promise<boolean> => {
    return new Promise((resolve) => {
      setActiveRequirement(requirement);
      setIsConsentOpen(true);
      setResolveCallback(() => resolve);
    });
  };

  const closeConsent = () => {
    setIsConsentOpen(false);
    if (resolveCallback) resolveCallback(false);
    setResolveCallback(null);
  };

  const confirmConsent = () => {
    setIsConsentOpen(false);
    if (resolveCallback) resolveCallback(true);
    setResolveCallback(null);
  };

  return (
    <ConsentContext.Provider value={{ 
      requestConsent, 
      isConsentOpen, 
      activeRequirement, 
      closeConsent, 
      confirmConsent 
    }}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within ConsentProvider');
  return context;
};
