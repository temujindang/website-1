module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    fontFamily: {
      display: ["HK Grotesk", "HK Grotesk Legacy", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      body: ["HK Grotesk", "HK Grotesk Legacy", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      sans: ["HK Grotesk", "HK Grotesk Legacy", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      mono: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
    },
    extend: {
      colors: {
        gray: {
          '100': '#f5f5f5',
          '200': '#eeeeee',
          '300': '#e0e0e0',
          '400': '#bdbdbd',
          '500': '#9e9e9e',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121',
        },
        'oxide-gray': '#222222',
        'oxide-green': '#48d597',
      },
      inset: {
        '-2': '-0.5rem',
        '-4': '-1rem',
        '-16': '-4rem',
      },
      spacing: {
        'xxs': '0.125rem',
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ],
  corePlugins: {
    gridTemplateColumns: true,
  }
}
