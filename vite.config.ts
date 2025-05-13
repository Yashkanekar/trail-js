// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Detect build mode from CLI
const isLibMode = process.env.BUILD === "lib";

export default defineConfig({
  plugins: [react()],
  ...(isLibMode
    ? {
        build: {
          lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "WalkthroughLibrary",
            formats: ['es', 'cjs', 'umd'],
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
