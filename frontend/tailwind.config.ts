import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      "colors": {
              "on-secondary-container": "rgb(var(--on-secondary-container) / <alpha-value>)",
              "tertiary-fixed": "rgb(var(--tertiary-fixed) / <alpha-value>)",
              "tertiary": "rgb(var(--tertiary) / <alpha-value>)",
              "on-surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
              "primary-fixed": "rgb(var(--primary-fixed) / <alpha-value>)",
              "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
              "inverse-surface": "rgb(var(--inverse-surface) / <alpha-value>)",
              "error": "rgb(var(--error) / <alpha-value>)",
              "secondary": "rgb(var(--secondary) / <alpha-value>)",
              "on-error": "rgb(var(--on-error) / <alpha-value>)",
              "tertiary-fixed-dim": "rgb(var(--tertiary-fixed-dim) / <alpha-value>)",
              "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
              "on-primary-fixed-variant": "rgb(var(--on-primary-fixed-variant) / <alpha-value>)",
              "inverse-on-surface": "rgb(var(--inverse-on-surface) / <alpha-value>)",
              "primary-fixed-dim": "rgb(var(--primary-fixed-dim) / <alpha-value>)",
              "on-tertiary": "rgb(var(--on-tertiary) / <alpha-value>)",
              "on-primary-fixed": "rgb(var(--on-primary-fixed) / <alpha-value>)",
              "surface-container-highest": "rgb(var(--surface-container-highest) / <alpha-value>)",
              "surface-bright": "rgb(var(--surface-bright) / <alpha-value>)",
              "on-tertiary-fixed-variant": "rgb(var(--on-tertiary-fixed-variant) / <alpha-value>)",
              "outline": "rgb(var(--outline) / <alpha-value>)",
              "secondary-container": "rgb(var(--secondary-container) / <alpha-value>)",
              "on-error-container": "rgb(var(--on-error-container) / <alpha-value>)",
              "inverse-primary": "rgb(var(--inverse-primary) / <alpha-value>)",
              "tertiary-container": "rgb(var(--tertiary-container) / <alpha-value>)",
              "on-tertiary-container": "rgb(var(--on-tertiary-container) / <alpha-value>)",
              "surface-variant": "rgb(var(--surface-variant) / <alpha-value>)",
              "surface-tint": "rgb(var(--surface-tint) / <alpha-value>)",
              "on-secondary-fixed-variant": "rgb(var(--on-secondary-fixed-variant) / <alpha-value>)",
              "surface-dim": "rgb(var(--surface-dim) / <alpha-value>)",
              "background": "rgb(var(--background) / <alpha-value>)",
              "on-secondary": "rgb(var(--on-secondary) / <alpha-value>)",
              "surface": "rgb(var(--surface) / <alpha-value>)",
              "on-tertiary-fixed": "rgb(var(--on-tertiary-fixed) / <alpha-value>)",
              "surface-container": "rgb(var(--surface-container) / <alpha-value>)",
              "primary": "rgb(var(--primary) / <alpha-value>)",
              "surface-container-high": "rgb(var(--surface-container-high) / <alpha-value>)",
              "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
              "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
              "on-background": "rgb(var(--on-background) / <alpha-value>)",
              "surface-container-lowest": "rgb(var(--surface-container-lowest) / <alpha-value>)",
              "on-primary-container": "rgb(var(--on-primary-container) / <alpha-value>)",
              "surface-container-low": "rgb(var(--surface-container-low) / <alpha-value>)",
              "secondary-fixed": "rgb(var(--secondary-fixed) / <alpha-value>)",
              "on-secondary-fixed": "rgb(var(--on-secondary-fixed) / <alpha-value>)",
              "secondary-fixed-dim": "rgb(var(--secondary-fixed-dim) / <alpha-value>)",
              "error-container": "rgb(var(--error-container) / <alpha-value>)",
      },
      "borderRadius": {
              "DEFAULT": "0.125rem",
              "lg": "0.25rem",
              "xl": "0.5rem",
              "full": "0.75rem"
      },
      "spacing": {
              "stack-sm": "8px",
              "stack-md": "16px",
              "margin-mobile": "16px",
              "margin-desktop": "48px",
              "gutter": "24px",
              "unit": "4px",
              "stack-lg": "32px"
      },
      "fontFamily": {
              "body-md": ["Inter"],
              "body-lg": ["Inter"],
              "headline-sm": ["Inter"],
              "headline-md": ["Inter"],
              "headline-lg-mobile": ["Inter"],
              "status-indicator": ["Atkinson Hyperlegible Next"],
              "label-caps": ["Atkinson Hyperlegible Next"],
              "headline-lg": ["Inter"]
      },
      "fontSize": {
              "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
              "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
              "headline-sm": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
              "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
              "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
              "status-indicator": ["14px", {"lineHeight": "20px", "fontWeight": "600"}],
              "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
              "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
};
export default config;
