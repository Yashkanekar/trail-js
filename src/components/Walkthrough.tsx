import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWalkthroughContext } from "../context/WalkthroughContext";
import { type WalkthroughStep } from "../types";
import "../styles/walkthrough.css";
import { waitForSelector } from "../utils/waitForSelector";
import { Toaster } from "react-hot-toast";

const Walkthrough = () => {
  const { steps, currentStepIndex, isActive, next, back, skip, goToStep } =
    useWalkthroughContext();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep: WalkthroughStep = steps[currentStepIndex];

  useEffect(() => {
    if (!isActive) return;

    const el = document.querySelector(currentStep.selector);

    let isMounted = true;
    waitForSelector(currentStep.selector, 5000)
      .then(() => {
        if (el) {
          if (!isMounted) return;
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
          currentStep.onEnter?.();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          setTargetRect(null);
        }
      })
      .catch(console.error);

    if (tooltipRef.current) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setTooltipSize({ width: offsetWidth, height: offsetHeight });
    }

    return () => {
      isMounted = false;
    };
  }, [currentStepIndex, isActive, currentStep.content]);

  if (!isActive || !targetRect) return null;

  const placement = currentStep.placement || "bottom";

  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 1001,
    ...(() => {
      const spacing = 10;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      switch (placement) {
        case "top":
          return {
            top: targetRect.top + scrollY - tooltipSize.height - spacing,
            left:
              targetRect.left +
              scrollX +
              targetRect.width / 2 -
              tooltipSize.width / 2,
          };
        case "left":
          return {
            top:
              targetRect.top +
              scrollY +
              targetRect.height / 2 -
              tooltipSize.height / 2,
            left: targetRect.left + scrollX - tooltipSize.width - spacing,
          };
        case "right":
          return {
            top:
              targetRect.top +
              scrollY +
              targetRect.height / 2 -
              tooltipSize.height / 2,
            left: targetRect.left + scrollX + targetRect.width + spacing,
          };
        case "bottom":
        default:
          return {
            top: targetRect.top + scrollY + targetRect.height + spacing,
            left:
              targetRect.left +
              scrollX +
              targetRect.width / 2 -
              tooltipSize.width / 2,
          };
      }
    })(),
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: targetRect.top + window.scrollY,
    left: targetRect.left + window.scrollX,
    width: targetRect.width,
    height: targetRect.height,
    border: "2px solid #00f",
    borderRadius: "4px",
    zIndex: 1001,
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
      </div>
      <Toaster/>
    </>,
    document.body
  );
};

export default Walkthrough;
