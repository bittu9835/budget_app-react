/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      textColor:{
        skin:{
          base: 'var(--color-text-base)',
          muted:'var(--color-text-muted)',
          inverted:'var(--color-text-inverted)',
        }
      },
      backgroundColor:{
        skin:{
              fill:'var(--color-fill)'
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

