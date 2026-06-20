import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      "colors": {
              "on-secondary-container": "#684000",
              "tertiary-fixed": "#ffdad6",
              "tertiary": "#a50710",
              "on-surface-variant": "#3e4947",
              "primary-fixed": "#9cf2e8",
              "on-surface": "#111c2d",
              "inverse-surface": "#263143",
              "error": "#ba1a1a",
              "secondary": "#855300",
              "on-error": "#ffffff",
              "tertiary-fixed-dim": "#ffb4ab",
              "outline-variant": "#bdc9c6",
              "on-primary-fixed-variant": "#00504a",
              "inverse-on-surface": "#ecf1ff",
              "primary-fixed-dim": "#80d5cb",
              "on-tertiary": "#ffffff",
              "on-primary-fixed": "#00201d",
              "surface-container-highest": "#d8e3fb",
              "surface-bright": "#f9f9ff",
              "on-tertiary-fixed-variant": "#93000b",
              "outline": "#6e7977",
              "secondary-container": "#fea619",
              "on-error-container": "#93000a",
              "inverse-primary": "#80d5cb",
              "tertiary-container": "#c92926",
              "on-tertiary-container": "#ffe4e0",
              "surface-variant": "#d8e3fb",
              "surface-tint": "#006a63",
              "on-secondary-fixed-variant": "#653e00",
              "surface-dim": "#cfdaf2",
              "background": "#f9f9ff",
              "on-secondary": "#ffffff",
              "surface": "#f9f9ff",
              "on-tertiary-fixed": "#410002",
              "surface-container": "#e7eeff",
              "primary": "#005c55",
              "surface-container-high": "#dee8ff",
              "on-primary": "#ffffff",
              "primary-container": "#0f766e",
              "on-background": "#111c2d",
              "surface-container-lowest": "#ffffff",
              "on-primary-container": "#a3faef",
              "surface-container-low": "#f0f3ff",
              "secondary-fixed": "#ffddb8",
              "on-secondary-fixed": "#2a1700",
              "secondary-fixed-dim": "#ffb95f",
              "error-container": "#ffdad6"
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
