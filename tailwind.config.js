/** @type {import('tailwindcss').Config} */

const { transparent } = require('daisyui/src/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    fontFamily: {
      primary: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        white: '#FAFAFA',
        black: '#1A1829',
        content: {
          primary: '#FAFAFA',
        },
        card: {
          primary: '#262229',
        },
        base: {
          50: '#37323D',
        },
      },
    },
  },
  // add daisyUI plugin
  // disable esline because it will give Error: Unexpected require()
  /* eslint-disable */
  plugins: [require('daisyui')],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [{
      multiclique: {

        // default
        default: '#000',
        'default-outline': transparent,
        'default-hover': '#0D0D0D',
        'default-active': '#000',
        'default-disabled': '#000',


        'primary': '#1128A2',
        'primary-hover': '#0C1856',
        'primary-disabled': '#1128A2',

        // 'primary-focus': '#781818',
        // 'primary-content': '#000',
        // "secondary": "#FF7A00",
        // 'secondary-focus': '#D26400',
        // 'secondary-content': '#1E1B21',
        // "accent": "#A3E635",
        // 'accent-focus': '#87BB2B',
        // 'accent-content': '#1E1B21',
        // 'neutral': '#FAFAFA',
        // 'neutral-focus': '#ABABAB',
        // 'neutral-content': '#1E1B21',
        "base-100": "#F5F5F5",
        'base-200': '#fff',
        'base-300': '#C5C5C5',
        'base-content': '#000',
        // 'base-container': '#050215',
        // "info": "#38BDF8",
        // 'info-content': '#002B3D',
        // "success": "#A3E635",
        // 'success-content': '#233800',
        // "warning": "#FB923C",
        // 'warning-content': '#3D1C00',
        // "error": "#FDA4AF",
        // 'error-content': '#52000A'

        "--border-btn": '0.5px',
        ".btn-outline": {
          "border-color": '#C5C5C5'
        },
        ".btn-outline:hover": {
          'background-color': '#f2f2f2',
          'color': '#000'
        }
      }
    },
      'night'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'multiclique',
  },
};
