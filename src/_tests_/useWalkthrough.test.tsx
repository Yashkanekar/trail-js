import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import {
  WalkthroughProvider,
  useWalkthroughContext,
} from "../context/WalkthroughContext";
import type { WalkthroughStep } from "../types";

const steps: WalkthroughStep[] = [
  { selector: "#a", content: "A" },
  { selector: "#b", content: "B" },
];

describe("useWalkthroughContext hook", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WalkthroughProvider steps={steps}>{children}</WalkthroughProvider>
  );

  it("starts inactive and can be started", () => {
    const { result } = renderHook(() => useWalkthroughContext(), { wrapper });
    expect(result.current.isActive).toBe(false);

    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);
    expect(result.current.currentStepIndex).toBe(0);
  });

  it("navigates next and back correctly", () => {
    const { result } = renderHook(() => useWalkthroughContext(), { wrapper });
    act(() => result.current.start());
    expect(result.current.currentStepIndex).toBe(0);

    act(() => result.current.next());
    expect(result.current.currentStepIndex).toBe(1);

    act(() => result.current.back());
    expect(result.current.currentStepIndex).toBe(0);
  });

  it("skips and resets on finish", () => {
    const { result } = renderHook(() => useWalkthroughContext(), { wrapper });
    act(() => result.current.start());
    act(() => result.current.skip());
    expect(result.current.isActive).toBe(false);
    expect(result.current.currentStepIndex).toBe(0);
  });
});
