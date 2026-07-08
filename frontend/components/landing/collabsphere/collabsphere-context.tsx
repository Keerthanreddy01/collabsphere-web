"use client";

import React, { createContext, useContext, useState } from "react";

interface CollabsphereContextType {
  ready: boolean;
  setReady: (val: boolean) => void;
}

const CollabsphereContext = createContext<CollabsphereContextType>({
  ready: false,
  setReady: () => {},
});

export function CollabsphereProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <CollabsphereContext.Provider value={{ ready, setReady }}>
      {children}
    </CollabsphereContext.Provider>
  );
}

export function useCollabsphere() {
  return useContext(CollabsphereContext);
}
