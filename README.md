# 🧭 trail-js

A flexible, minimalistic walkthrough library for React apps. Build guided user tours with step-by-step overlays, tooltips, and logic-based navigation. Perfect for onboarding, product tours, and in-app guidance—fully customizable and framework-agnostic.

<div align="center">
  <h2>
      🚀 Try the Interactive Demo
  </h2>
  <p align="center">
    <strong>Explore a live walkthrough experience using all of trail-js' features.</strong><br/>
    Conditional steps, lifecycle events, custom UIs—see it all in action.<br/>
    <em>Click, explore, and learn how powerful simple guidance can be!</em>
  </p>
  <a href="https://trail-js-demo.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/LIVE_DEMO-Try_Now!-blue?style=for-the-badge&logo=react" alt="Live Demo" />
  </a>
</div>

---

## 🧰 Features

- 🪄 **Step-by-step Overlays**: Highlight any DOM element with tooltips and callouts.
- 🎛️ **Custom Navigation UI**: Override navigation controls with your own components.
- ⚡ **Conditional Logic**: Use `canGoNext()` to enable/disable step transitions.
- 🔁 **Lifecycle Hooks**: Add `onEnter` callbacks for side effects or state updates.
- 🧠 **State-Aware**: Dynamically change steps based on your app state.
- 🎨 **Custom Styling**: Control placement, animation, and appearance of tooltips.
- 🔌 **Framework-Agnostic API**: Bring your own UI components and controls.
- 📦 **Fully Typed**: TypeScript-first developer experience.

---

## 📦 Installation

```bash
# npm
npm install trail-js


| Property           | Type                                     | Description                        |
| ------------------ | ---------------------------------------- | ---------------------------------- |
| `selector`         | `string`                                 | CSS selector to attach tooltip     |
| `content`          | `ReactNode`                              | Tooltip content                    |
| `placement`        | `"top" \| "bottom" \| "left" \| "right"` | Position relative to target        |
| `canGoNext`        | `() => boolean`                          | Optional function to gate progress |
| `onEnter`          | `() => void`                             | Callback fired when step is shown  |
| `customNavigation` | `({ goNext, goPrev, close }) => JSX`     | Custom nav component override      |
