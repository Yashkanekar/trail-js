import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { WalkthroughStep } from "../types";

type WalkthroughContextType = {
  steps: WalkthroughStep[];
  currentStepIndex: number;
  isActive: boolean;
  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  finish: () => void;
  goToStep: (index: number) => void;
};

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(
  undefined
);

type WalkthroughProviderProps = {
  steps: WalkthroughStep[];
  children: ReactNode;
};

export const WalkthroughProvider = ({
  steps,
  children,
}: WalkthroughProviderProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const start = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const next = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    } else {
      finish();
    }
  };

  const back = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
    }
  };

  const skip = () => {
    setIsActive(false);
  };

  const finish = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      setIsActive(true);
    }
  };

  return (
    <WalkthroughContext.Provider
      value={{
        steps,
        currentStepIndex,
        isActive,
        start,
        next,
        back,
        skip,
        finish,
        goToStep,
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
};

export const useWalkthroughContext = (): WalkthroughContextType => {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error(
      "useWalkthroughContext must be used within a WalkthroughProvider"
    );
  }
  return context;
};
