export type Placement = "top" | "bottom" | "left" | "right" | "auto";

export type WalkthroughStep = {
  selector: string;
  content: string | React.ReactNode;
  placement?: Placement;
  onNext?: () => void;
  onBack?: () => void;
  onEnter?: () => void;
};
