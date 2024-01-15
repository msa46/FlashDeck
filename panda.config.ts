import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // The preset to use
  presets: ['@shadow-panda/preset'],

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  staticCss: {
    recipes: {
      // Load toast variant styles since it cannot be statically analyzed
      toast: [{ variant: ['*'] }],
    },
  },

  // Use React
  jsxFramework: 'react',

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  emitPackage: true,
  outdir: '@shadow-panda/styled-system',

});
