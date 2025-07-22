import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWalkthroughContext } from "../context/WalkthroughContext";
import { type WalkthroughStep } from "../types";
import "../styles/walkthrough.css";
import { Toaster } from "react-hot-toast";

const Walkthrough = () => {
  const { steps, currentStepIndex, isActive, next, back, skip, goToStep } =
    useWalkthroughContext();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const tooltipRef = useRef<HTMLDivElement>(null);
  const currentStep: WalkthroughStep = steps[currentStepIndex];

  // Phase 1: scroll to element & measure its rect
  useEffect(() => {
    if (!isActive) return;
    let mounted = true;

    const initStep = async () => {
      const el = document.querySelector(currentStep.selector);
      if (!el || !mounted) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      await new Promise((r) => setTimeout(r, 400));
      if (!mounted) return;
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      currentStep.onEnter?.();
    };

    const updateRect = () => {
      const el = document.querySelector(currentStep.selector);
      if (el && mounted) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    initStep();
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);
    return () => {
      mounted = false;
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [currentStepIndex, isActive, currentStep.selector]);

  // Phase 2: once we have a rect, measure & position tooltip in document space
  useLayoutEffect(() => {
    if (!targetRect) return;
    const tEl = tooltipRef.current;
    if (!tEl) return;

    // measure tooltip
    const tSize = { width: tEl.offsetWidth, height: tEl.offsetHeight };
    setTooltipSize(tSize);

    const spacing = 10;
    const { top, left, width, height } = targetRect;
    const sx = window.scrollX,
      sy = window.scrollY;
    let x = 0,
      y = 0;

    switch (currentStep.placement || "bottom") {
      case "top":
        y = top + sy - tSize.height - spacing;
        x = left + sx + width / 2 - tSize.width / 2;
        break;
      case "left":
        y = top + sy + height / 2 - tSize.height / 2;
        x = left + sx - tSize.width - spacing;
        break;
      case "right":
        y = top + sy + height / 2 - tSize.height / 2;
        x = left + sx + width + spacing;
        break;
      default: // bottom
        y = top + sy + height + spacing;
        x = left + sx + width / 2 - tSize.width / 2;
    }

    // clamp within document viewport bounds if desired
    const clampedX = Math.max(
      spacing,
      Math.min(x, document.documentElement.scrollWidth - tSize.width - spacing)
    );
    const clampedY = Math.max(
      spacing,
      Math.min(
        y,
        document.documentElement.scrollHeight - tSize.height - spacing
      )
    );

    setTooltipPos({ top: clampedY, left: clampedX });
  }, [targetRect, currentStepIndex]);

  if (!isActive || !targetRect) return null;

  // compute full document dimensions for backdrop
  const docH = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  const docW = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth
  );

  const { top, left, width, height } = targetRect;
  const sx = window.scrollX,
    sy = window.scrollY;
  const showBackdrop = currentStep.showBackdrop ?? true;

  // backdrop bands
  const backdropPieces = [
    { top: 0, left: 0, width: docW, height: top + sy },
    { top: top + sy, left: 0, width: left + sx, height },
    {
      top: top + sy,
      left: left + width + sx,
      width: docW - (left + width + sx),
      height,
    },
    {
      top: top + height + sy,
      left: 0,
      width: docW,
      height: docH - (top + height + sy),
    },
  ];

  const highlightStyle: React.CSSProperties = {
    position: "absolute",
    top: top + sy,
    left: left + sx,
    width,
    height,
    borderRadius: "4px",
    pointerEvents: "none",
  };

  return createPortal(
    <>
      {showBackdrop &&
        backdropPieces.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              background: "rgba(0,0,0,0.5)",
              pointerEvents: "none",
              zIndex: 999,
              ...b,
            }}
          />
        ))}

      <div className="walkthrough-highlight" style={highlightStyle} />

      <div
        className={`walkthrough-tooltip ${currentStep.tooltipClassName || ""}`}
        ref={tooltipRef}
        style={{
          position: "absolute", // absolute so it scrolls with document
          top: tooltipPos.top,
          left: tooltipPos.left,
          zIndex: 1001,
          ...currentStep.tooltipStyle,
        }}
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

      <Toaster />
    </>,
    document.body
  );
};

export default Walkthrough;
