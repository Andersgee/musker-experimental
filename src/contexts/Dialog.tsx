"use client";

import React, { useState, createContext, useContext } from "react";

type Props = {
  showSignIn: boolean;
  setShowSignIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue: Props = {
  showSignIn: false,
  setShowSignIn: () => null,
};

const Context = createContext(defaultValue);

interface ProviderProps {
  children: React.ReactNode;
}

export function DialogProvider({ children }: ProviderProps) {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <Context.Provider
      value={{
        showSignIn,
        setShowSignIn,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDialogContext = () => useContext(Context);
