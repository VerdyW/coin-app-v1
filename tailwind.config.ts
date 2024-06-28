import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        primary: '#0f3f89',

        'Primary': {
        '50': '#effefb',
        '100': '#c8fff3',
        '200': '#90ffe7',
        '300': '#51f7da',
        '400': '#1de4c7',
        '500': '#05c7ae',
        '600': '#00a18f',
        '700': '#058074',
        '800': '#0a655d',
        '900': '#0e534e',
        '950': '#004643',
    },

    'Secondary': {
        '50': '#fdfbed',
        '100': '#faf4d3',
        '200': '#f3e494',
        '300': '#edd25c',
        '400': '#e8bf37',
        '500': '#e1a21f',
        '600': '#c77e18',
        '700': '#a55c18',
        '800': '#86481a',
        '900': '#6f3c18',
        '950': '#3f1e09',
    },

    'Third': {
        '50': '#f1fafa',
        '100': '#ddf0ef',
        '200': '#bee3e3',
        '300': '#91cfcf',
        '400': '#5db2b3',
        '500': '#429698',
        '600': '#397b81',
        '700': '#34656a',
        '800': '#315559',
        '900': '#2c484d',
        '950': '#0c1618',
    },
    

      },

      height: {
        '750px': '750px'
      }
    },
  },
  plugins: [],
};
export default config;
