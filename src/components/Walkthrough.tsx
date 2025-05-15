import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWalkthroughContext } from "../context/WalkthroughContext";
import { type WalkthroughStep } from "../types";
import "../styles/walkthrough.css";

const Walkthrough = () => {
  const { steps, currentStepIndex, isActive, next, back, skip, goToStep } =
    useWalkthroughContext();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep: WalkthroughStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isActive) return;

    const el = document.querySelector(currentStep.selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      currentStep.onEnter?.();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTargetRect(null);
    }
  }, [currentStepIndex, isActive]);

  if (!isActive || !targetRect) return null;

  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    top: targetRect.top + window.scrollY + targetRect.height + 10,
    left: targetRect.left + window.scrollX,
    zIndex: 1001,
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: targetRect.top + window.scrollY - 5,
    left: targetRect.left + window.scrollX - 5,
    width: targetRect.width + 10,
    height: targetRect.height + 10,
    border: "2px solid #00f",
    borderRadius: "4px",
    zIndex: 1000,
    pointerEvents: "none",
  };

  return createPortal(
    <>
      <div className="walkthrough-backdrop" />
      <div className="walkthrough-highlight" style={overlayStyle} />
      <div
        className="walkthrough-tooltip"
        ref={tooltipRef}
        style={tooltipStyle}
      >
        <div className="tooltip-content">{currentStep.content}</div>
        {typeof currentStep.customNavigation === "function" ? (
          currentStep.customNavigation({ next, back, skip, goToStep })
        ) : ( 
          <div className="tooltip-buttons">
            <button onClick={back} disabled={currentStepIndex === 0}>
              Back
            </button>
            <button onClick={next}>
              {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
            </button>
            <button onClick={skip}>Skip</button>
          </div>
        )}
        {/* <div className="tooltip-buttons">
          <button onClick={back} disabled={currentStepIndex === 0}>
            Back
          </button>
          <button onClick={next}>
            {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
          </button>
          <button onClick={skip}>Skip</button>
        </div> */}
      </div>
    </>,
    document.body
  );
};

export default Walkthrough;
