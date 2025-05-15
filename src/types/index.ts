import type { ReactNode } from "react";

export type Placement = "top" | "bottom" | "left" | "right" | "auto";

export interface WalkthroughStep {
  selector: string;
  content: string;
  placement?: Placement;
  triggerEvent?: string;
  onEnter?: () => void;
  onExit?: () => void;

  customNavigation?: (controls: WalkthroughControls) => ReactNode;
}

export type WalkthroughControls = {
  next: () => void;
  back: () => void;
  skip: () => void;
  goToStep: (index: number) => void;
};
