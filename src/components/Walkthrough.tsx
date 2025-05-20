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

    let isMounted = true;

    waitForSelector(currentStep.selector, 5000)
      .then(() => {
        const el = document.querySelector(currentStep.selector);
        if (el && isMounted) {
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
      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = targetRect.top + scrollY - tooltipSize.height - spacing;
          left =
            targetRect.left +
            scrollX +
            targetRect.width / 2 -
            tooltipSize.width / 2;
          break;
        case "left":
          top =
            targetRect.top +
            scrollY +
            targetRect.height / 2 -
            tooltipSize.height / 2;
          left = targetRect.left + scrollX - tooltipSize.width - spacing;
          break;
        case "right":
          top =
            targetRect.top +
            scrollY +
            targetRect.height / 2 -
            tooltipSize.height / 2;
          left = targetRect.left + scrollX + targetRect.width + spacing;
          break;
        case "bottom":
        default:
          top = targetRect.top + scrollY + targetRect.height + spacing;
          left =
            targetRect.left +
            scrollX +
            targetRect.width / 2 -
            tooltipSize.width / 2;
          break;
      }

      // Clamp to keep within viewport
      const clampedLeft = Math.max(
        spacing,
        Math.min(left, window.innerWidth - tooltipSize.width - spacing)
      );
      const clampedTop = Math.max(
        spacing,
        Math.min(top, window.innerHeight - tooltipSize.height - spacing)
      );

      return {
        top: clampedTop,
        left: clampedLeft,
      };
    })(),
  };

  const showBackdrop = currentStep.showBackdrop ?? true;

  const backdropPieces = (() => {
    const { innerWidth: vw, innerHeight: vh } = window;
    const { top, left, width, height } = targetRect;

    return [
      {
        top: 0,
        left: 0,
        width: "100%",
        height: top + window.scrollY,
      },
      {
        top: top + window.scrollY,
        left: 0,
        width: left + window.scrollX,
        height,
      },
      {
        top: top + window.scrollY,
        left: left + width + window.scrollX,
        width: vw - (left + width),
        height,
      },
      {
        top: top + height + window.scrollY,
        left: 0,
        width: "100%",
        height: vh - (top + height),
      },
    ];
  })();

  const highlightStyle: React.CSSProperties = {
    position: "fixed",
    top: targetRect.top + window.scrollY,
    left: targetRect.left + window.scrollX,
    width: targetRect.width,
    height: targetRect.height,
    borderRadius: "4px",
    pointerEvents: "none",
  };

  return createPortal(
    <>
      {showBackdrop &&
        backdropPieces.map((style, i) => (
          <div
            key={i}
            style={{
              position: "fixed",
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
              pointerEvents: "none",
              ...style,
            }}
          />
        ))}

      <div className="walkthrough-highlight" style={highlightStyle} />

      <div
        className={`walkthrough-tooltip ${currentStep.tooltipClassName ?? ""}`}
        ref={tooltipRef}
        style={{ ...tooltipStyle, ...currentStep.tooltipStyle }}
      >
        <div className="tooltip-content">
          {typeof currentStep.content === "string" ? (
            <p>{currentStep.content}</p>
          ) : (
            currentStep.content
          )}
        </div>
        {typeof currentStep.customNavigation === "function" ? (
          currentStep.customNavigation({ next, back, skip, goToStep })
        ) : (
          <div className="tooltip-buttons">
            <button
              onClick={back}
              disabled={currentStepIndex === 0}
              className={currentStep.navButtonClassName}
              style={currentStep.navButtonStyle}
            >
              Back
            </button>
            <button
              onClick={next}
              className={currentStep.navButtonClassName}
              style={currentStep.navButtonStyle}
            >
              {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
            </button>
            <button
              onClick={skip}
              className={currentStep.navButtonClassName}
              style={currentStep.navButtonStyle}
            >
              Skip
            </button>
          </div>
        )}
      </div>
      <Toaster />
    </>,
    document.body
  );
};

export default Walkthrough;
