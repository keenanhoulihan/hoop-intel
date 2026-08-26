import type { Config } from "tailwindcss";

/**
 * Named tokens sourced from the CSS variables in globals.css — the palette
 * itself still lives there (one file to retheme), Tailwind just exposes it
 * as utility classes so components never write `bg-[#hex]` or `bg-[var(--x)]`.
 */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "var(--bone)",
        "bone-hi": "var(--bone-hi)",
        "bone-lo": "var(--bone-lo)",
        oak: "var(--oak)",
        "oak-dark": "var(--oak-dk)",
        bark: "var(--bark)",
        "bark-light": "var(--bark-lo)",
        walnut: "var(--walnut)",
        "walnut-2": "var(--walnut-2)",
        moss: "var(--moss)",
        "moss-wash": "var(--moss-lo)",
        "moss-mid": "var(--moss-mid)",
        "moss-hi": "var(--moss-hi)",
        clay: "var(--clay)",
        "clay-wash": "var(--clay-lo)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        rule: "var(--rule)",
        "rule-soft": "var(--rule-soft)",
      },
      fontFamily: {
        serif: ["var(--serif)"],
        sans: ["var(--sans)"],
        mono: ["var(--mono)"],
      },
      borderRadius: {
        DEFAULT: "2px",
        panel: "3px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(43, 33, 25, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
