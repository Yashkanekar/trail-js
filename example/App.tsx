import React from "react";
import {
  WalkthroughProvider,
  Walkthrough,
  useWalkthrough,
  type WalkthroughStep,
} from "../src";

const steps: WalkthroughStep[] = [
  {
    selector: "#step-one",
    content: "This is the first step. It highlights this button.",
    placement: "bottom",
  },
  {
    selector: "#step-two",
    content: "This is the second step. Look here!",
    placement: "right",
  },
  {
    selector: "#step-three",
    content: "This is the last step. Done!",
    placement: "top",
  },
];
const Controls = () => {
  const { start, isActive, currentStepIndex } = useWalkthrough();

  return (
    <div style={{ marginBottom: "2rem" }}>
      <button onClick={start}>Start Walkthrough</button>
      {isActive && <p>Currently on step {currentStepIndex + 1}</p>}
    </div>
  );
};

const App = () => {
  return (
    <WalkthroughProvider steps={steps}>
      <div style={{ padding: "2rem" }}>
        <h1>React Walkthrough Demo</h1>
        <Controls />

        <div style={{ marginTop: "3rem" }}>
          <button id="step-one">Step One Button</button>
        </div>

        <div style={{ marginTop: "4rem" }}>
          <input id="step-two" placeholder="Step Two Input" />
        </div>

        <div style={{ marginTop: "4rem" }}>
          <p id="step-three">Step Three Text</p>
        </div>

        <Walkthrough />
      </div>
    </WalkthroughProvider>
  );
};

export default App;
