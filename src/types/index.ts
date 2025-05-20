import type { ReactNode } from "react";

export type Placement = "top" | "bottom" | "left" | "right" | "auto";

export interface WalkthroughStep {
  selector: string;
  content: string | ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  triggerEvent?: string;
  onEnter?: () => void;
  onExit?: () => void;
  customNavigation?: (controls: WalkthroughControls) => ReactNode;
  canGoNext?: {
    validate: () => boolean | Promise<boolean>;
    errorString?: string;
  };
  beforeNext?: () => void | Promise<void>;
  showBackdrop?: boolean;
  tooltipClassName?: string;
  tooltipStyle?: React.CSSProperties;

  navButtonClassName?: string;
  navButtonStyle?: React.CSSProperties;
}

export type WalkthroughControls = {
  next: () => void;
  back: () => void;
  skip: () => void;
  goToStep: (index: number) => void;
};
