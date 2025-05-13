import { useWalkthroughContext } from "../context/WalkthroughContext";

/**
 * Public hook for external use
 * Gives access to walkthrough controls and state
 */
const useWalkthrough = () => {
  const {
    currentStepIndex,
    steps,
    isActive,
    start,
    next,
    back,
    skip,
    finish,
    goToStep,
  } = useWalkthroughContext();

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    totalSteps: steps.length,
    isActive,
    start,
    next,
    back,
    skip,
    finish,
    goToStep,
  };
};

export default useWalkthrough;
