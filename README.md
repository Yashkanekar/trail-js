# 🧭 trail-js — React Walkthrough / Guided Tour Library

**`trail-js`** is a lightweight, highly-customizable, and feature-rich walkthrough library for React apps. It allows developers to guide users through product features using interactive steps, tooltips, and navigation logic.

---

## ✨ Features

- Step-by-step guides with DOM element targeting
- Supports custom content (jsx support)
- `canGoNext` validations for conditional progression
- `beforeNext` async hooks for side effects
- Optional backdrop with focus highlighting
- Responsive positioning with auto-clamping
- Smooth scroll to target elements
- Dynamic tooltips with styling overrides


---

## 📦 Installation

```bash
npm install trail-js
# or
yarn add trail-js
```

---

## 🧠 Basic Usage

```tsx
import {
  WalkthroughProvider,
  Walkthrough,
  useWalkthrough,
  type WalkthroughStep,
} from "trail-js";

const steps: WalkthroughStep[] = [
  {
    selector: "#start-button",
    content: "Click this button to get started!",
    placement: "bottom",
  },
  {
    selector: "#name-input",
    content: "Enter your name before continuing.",
    placement: "top",
    canGoNext: {
      validate: () => !!document.getElementById("name-input")?.value,
      errorString: "Name is required!",
    },
  },
];

const App = () => (
  <WalkthroughProvider steps={steps}>
    <YourApp />
    <Walkthrough />
  </WalkthroughProvider>
);
```

---

## 🛠️ API Reference

### `WalkthroughProvider`

Wrap your app with this provider and pass the list of steps.

```tsx
<WalkthroughProvider steps={steps}>
  <App />
</WalkthroughProvider>
```

### `Walkthrough`

The tooltip and highlight overlay component. Should be placed inside `WalkthroughProvider`.

```tsx
<Walkthrough />
```



## 🔁 Step Object (`WalkthroughStep`)

```ts
type WalkthroughStep = {
  selector: string;
  content: string | ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  triggerEvent?: string;
  onEnter?: () => void;
  onExit?: () => void;
  beforeNext?: () => void | Promise<void>;
  canGoNext?: {
    validate: () => boolean | Promise<boolean>;
    errorString?: string;
  };
  showBackdrop?: boolean;
  tooltipClassName?: string;
  tooltipStyle?: React.CSSProperties;
  navButtonClassName?: string;
  navButtonStyle?: React.CSSProperties;
  customNavigation?: (controls: WalkthroughControls) => ReactNode;
}
```

### `customNavigation` Controls

```ts
type WalkthroughControls = {
  next: () => void;
  back: () => void;
  skip: () => void;
  goToStep: (index: number) => void;
};
```

---

<!-- ---

## 🧠 API Reference -->

### `useWalkthrough()`

Main hook to control walkthrough progression.

#### Returns

| Property         | Type                     | Description                                  |
|------------------|--------------------------|----------------------------------------------|
| `steps`          | `WalkthroughStep[]`      | All defined steps for the current walkthrough |
| `currentStepIndex` | `number`                | Index of the current active step              |
| `isActive`       | `boolean`                | Whether walkthrough is active or not         |
| `next`           | `() => void`             | Move to the next step                        |
| `back`           | `() => void`             | Move to the previous step                    |
| `skip`           | `() => void`             | Skip and end the walkthrough                 |
| `goToStep`       | `(index: number) => void`| Jump to a specific step                      |

---



## Use Cases

- User onboarding flows
- Feature discovery in SaaS apps
- Interactive documentation
- Admin dashboards and tutorials
- Demo mode for products

---

## 🎯 Examples

### 1. Basic Step with Default Navigation

```ts
{
  selector: "#submit-button",
  content: "Click to submit the form",
  placement: "right",
}
```

### 2. Step with Validation and Custom Error

```ts
{
  selector: "#email",
  content: "Please enter a valid email",
  canGoNext: {
    validate: () => /\S+@\S+\.\S+/.test(document.getElementById("email")?.value || ""),
    errorString: "Valid email required!",
  },
}
```

### 3. Step with Custom Navigation Buttons

```ts
{
  selector: "#next-step",
  content: "Custom nav UI",
  customNavigation: ({ next, back }) => (
    <div>
      <button onClick={back}>← Prev</button>
      <button onClick={next}>Next →</button>
    </div>
  ),
}
```

---

## 🎨 Styling

You can override default styles with CSS classes:

```css
.walkthrough-tooltip {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.walkthrough-overlay {
  background: rgba(0, 0, 0, 0.5);
}
```

Or use `tooltipClassName`, `tooltipStyle`, `navButtonClassName`, and `navButtonStyle` props per step.

---



## 🧪 Dev / Example

To run the demo locally:

```bash
npm install
npm run dev
```

---

## 📄 License

MIT License

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Open a PR

---

## 💬 Support

Feel free to [open an issue](https://github.com/Yashkanekar/trail-js/issues) or contact via discussions for help or feature requests.
