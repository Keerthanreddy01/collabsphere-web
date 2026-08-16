"use client";

import React, { createContext, useContext, useState } from "react";

interface SquiblContextType {
  ready: boolean;
  setReady: (val: boolean) => void;
}

const SquiblContext = createContext<SquiblContextType>({
  ready: false,
  setReady: () => {},
});

export function SquiblProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <SquiblContext.Provider value={{ ready, setReady }}>
      {children}
    </SquiblContext.Provider>
  );
}

export function useSquibl() {
  return useContext(SquiblContext);
}
