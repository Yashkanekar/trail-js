import {
  WalkthroughProvider,
  Walkthrough,
  useWalkthrough,
  type WalkthroughStep,
} from "../src";
import "./App.css";

const steps: WalkthroughStep[] = [
  {
    selector: "#step-one",
    content: "Click here to start the walkthrough",
    placement: "bottom",
    customNavigation: ({ next, skip }) => (
      <div>
        <button className="custom-next" onClick={next}>
          👉 Continue
        </button>
        <button className="custom-skip" onClick={skip}>
          ❌ Skip
        </button>
      </div>
    ),
  },
  {
    selector: "#step-two",
    content: (
      <div>
        <h3>Please enter your name</h3>
        <p>This input is required before continuing.</p>
      </div>
    ),
    placement: "top",
    tooltipClassName: "custom-tooltip",
    tooltipStyle: { backgroundColor: "#ffeeba", color: "#333" },
    canGoNext: {
      validate: () => {
        const val = document.getElementById("step-two")?.value;
        return !!val;
      },
      errorString: "Name is required!",
    },
  },
  {
    selector: "#step-three",
    content: "Click this button to submit",
    placement: "right",
    onEnter: () => {
      console.log("We're now highlighting the submit button!");
    },
    // navButtonClassName: "fancy-button",
  },
  {
    selector: "h1",
    content: "This is the main heading.",
    placement: "bottom",
    customNavigation: ({ back, next, skip }) => (
      <div>
        <button onClick={back}>👈 Back</button>
        <button onClick={next}>👉 Continue</button>
        <button onClick={skip}>❌ Skip</button>
      </div>
    ),

    navButtonStyle: {
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "5px",
      padding: "0.5rem 1rem",
    },
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
