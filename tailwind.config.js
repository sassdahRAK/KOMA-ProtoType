/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Keep the shared surface classes available even before every page uses them.
  safelist: ['card', 'krama', 'krama-v', 'mono-label', 'measure', 'focusable'],
  theme: {
    extend: {
      colors: {
        // Logo-derived palette. Token NAMES are unchanged; values only.
        paper: '#F7FAFA',
        'paper-deep': '#EAF2F4',
        shell: '#FFFFFF',
        pine: {
          DEFAULT: '#14656F',
          800: '#17555E',
          700: '#1A6570',
        },
        teal: {
          DEFAULT: '#1E8E9C',
          600: '#16707C',
          100: '#CFE9EE',
          50: '#EEF7F9',
        },
        mint: '#D8F0F3',
        saffron: {
          DEFAULT: '#EE9E33',
          tint: '#FDF1DF',
          ink: '#7A4A05',
        },
        clay: {
          DEFAULT: '#D8352F',
          tint: '#FBE7E5',
          ink: '#8E2019',
        },
        ink: {
          DEFAULT: '#10262B',
          soft: '#415B60',
          faint: '#5F797E',
        },
        line: '#DCE8EA',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Noto Sans Khmer"', 'Georgia', 'serif'],
        sans: ['Manrope', '"Noto Sans Khmer"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        khmer: ['"Noto Sans Khmer"', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        lift: '0 1px 2px rgba(16, 38, 43, 0.04), 0 8px 24px -12px rgba(20, 101, 111, 0.16)',
      },
      borderRadius: {
        card: '22px',
      },
      maxWidth: {
        measure: '62ch',
      },
    },
  },
  plugins: [],
}
