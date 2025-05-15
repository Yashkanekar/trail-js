import {
  WalkthroughProvider,
  Walkthrough,
  useWalkthrough,
  type WalkthroughStep,
} from "../src";

const steps: WalkthroughStep[] = [
  {
    selector: "#step-one",
    content: "Click here to start the walkthrough",
    placement: "bottom",
  },
  {
    selector: "#step-two",
    content: "Enter your name here. This input is required before proceeding.",
    placement: "top",
    canGoNext: {
      validate: () => {
        const val = document.getElementById("step-two")?.value;
        if (!val) {
          // toast.error("Name is required to continue!");
          return false;
        }
        return true;
      },
      errorString: "Name is required to continue!",
    },
  },
  {
    selector: "#step-three",
    content: "Click this button to submit",
    placement: "right",
    onEnter: () => {
      console.log("We're now highlighting the submit button!");
    },
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
