import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// Detect build mode from CLI
const isLibMode = process.env.BUILD === "lib";

export default defineConfig({
  plugins: isLibMode ? [react(), cssInjectedByJsPlugin()] : [react()],
  ...(isLibMode
    ? {
        build: {
          lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "WalkthroughLibrary",
            formats: ["es", "cjs", "umd"],
            fileName: (format) => `index.${format}.js`,
          },
          rollupOptions: {
            external: ["react", "react-dom"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
              },
            },
          },
          cssCodeSplit: false, // Ensure CSS is split into a separate file
          emptyOutDir: false, // ✅ Add this line
        },
      }
    : {
        root: "example",
        publicDir: "../public",
        build: {
          outDir: "../dist-example",
        },
      }),
});
