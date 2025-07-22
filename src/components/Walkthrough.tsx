import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWalkthroughContext } from "../context/WalkthroughContext";
import type { WalkthroughStep } from "../types";
import "../styles/walkthrough.css";
import { waitForSelector } from "../utils/waitForSelector";
import { Toaster } from "react-hot-toast";

const Walkthrough = () => {
  const { steps, currentStepIndex, isActive, next, back, skip, goToStep } =
    useWalkthroughContext();
  const currentStep: WalkthroughStep = steps[currentStepIndex];
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // holds latest element rect (viewport coords)
  const [rect, setRect] = useState<DOMRect | null>(null);
  // where to place the tooltip (viewport coords)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    let mounted = true;

    const update = () => {
      const el = document.querySelector(currentStep.selector);
      if (!el || !mounted) return;
      const r = el.getBoundingClientRect();
      setRect(r);

      // measure tooltip size
      const tEl = tooltipRef.current;
      const tW = tEl?.offsetWidth ?? 0;
      const tH = tEl?.offsetHeight ?? 0;
      const spacing = 10;
      let top = 0,
        left = 0;

      switch (currentStep.placement) {
        case "top":
          top = r.top - tH - spacing;
          left = r.left + r.width / 2 - tW / 2;
          break;
        case "left":
          top = r.top + r.height / 2 - tH / 2;
          left = r.left - tW - spacing;
          break;
        case "right":
          top = r.top + r.height / 2 - tH / 2;
          left = r.right + spacing;
          break;
        default: // "bottom"
          top = r.bottom + spacing;
          left = r.left + r.width / 2 - tW / 2;
      }

      // clamp horizontally inside viewport
      left = Math.max(
        spacing,
        Math.min(left, window.innerWidth - tW - spacing)
      );
      // clamp vertically
      top = Math.max(spacing, Math.min(top, window.innerHeight - tH - spacing));

      setTooltipPos({ top, left });
    };

    (async () => {
      // Hide it while we scroll/measuring…
      setTooltipVisible(false);
      await waitForSelector(currentStep.selector, 5000);
      if (!mounted) return;
      const el = document.querySelector(currentStep.selector)!;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // slightly wait for scroll
      await new Promise((r) => setTimeout(r, 300));
      if (!mounted) return;
      update();
      setTooltipVisible(true);
      currentStep.onEnter?.();
    })();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      mounted = false;
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [currentStepIndex, isActive, currentStep.selector]);

  if (!isActive || !rect) return null;

  // full-document backdrop
  const docH = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  const docW = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth
  );
  const sx = window.scrollX,
    sy = window.scrollY;
  const { top: rT, left: rL, width: rW, height: rH } = rect;

  const backdrop = [
    { top: 0, left: 0, width: docW, height: rT + sy },
    { top: rT + sy, left: 0, width: rL + sx, height: rH },
    {
      top: rT + sy,
      left: rL + rW + sx,
      width: docW - (rL + rW + sx),
      height: rH,
    },
    { top: rT + rH + sy, left: 0, width: docW, height: docH - (rT + rH + sy) },
  ];

  return createPortal(
    <>
      {currentStep.showBackdrop !== false &&
        backdrop.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              background: "rgba(0,0,0,0.5)",
              pointerEvents: "none",
              ...s,
            }}
          />
        ))}

      <div
        className="walkthrough-highlight"
        style={{
          position: "absolute",
          top: rT + sy,
          left: rL + sx,
          width: rW,
          height: rH,
          borderRadius: 4,
          pointerEvents: "none",
        }}
      />

      {tooltipVisible && (
        <div
          ref={tooltipRef}
          className={`walkthrough-tooltip ${
            currentStep.tooltipClassName ?? ""
          }`}
          style={{
            position: "fixed",
            top: tooltipPos.top,
            left: tooltipPos.left,
            zIndex: 1000,
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
      )}

      <Toaster />
    </>,
    document.body
  );
};

export default Walkthrough;
