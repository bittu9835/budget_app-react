/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      textColor: {
        skin: {
          'text': 'var(--color-text)',
          'logo': 'var(--color-logo)',
          'text-dashboard': 'var(--color-text-dashboard)',
          'sideNav-text': 'var(--color-sideNav-text)',
          'active-nav-text': 'var(--color-active-nav-text)',
          'topNav-text': 'var(--color-topNav-text)',
          'topNav-secondery-text': 'var(--color-topNav-secondery-text)',
          'profile-text': 'var(--color-profile-text)',
          'profile-text-hover': 'var(--color-profile-text-hover)',
          'profile-secondery-text': 'var(--color-profile-secondery-text)',
          'table-head-text': 'var(--color-table-head-text)',
          'table-hover': 'var(--color-table-hover)',
          'button-text': 'var(--color-button-text)',
        }
      },
      backgroundColor: {
        skin: {
          'bg-color': 'var(--color-bg-color)',
          'bg-outlet': 'var(--color-bg-outlet)',
          'bg-dashboard': 'var(--color-bg-dashboard)',
          'bg-sideNav': 'var(--color-bg-sideNav)',
          'bg-topNav': 'var(--color-bg-topNav)',
          'bg-profile': 'var(--color-bg-profile)',
          'bg-table-head-bg': 'var(--color-table-head-bg)',
          'bg-table-hover': 'var(--color-table-hover)',
          'bg-table': 'var(--color-table)',
          'bg-button-bg': 'var(--color-button-bg)',
          'bg-button-hover': 'var(--color-button-hover)',
          'bg-button-muted': 'var(--color-button-muted)',
        }
      },
      borderColor: {
        skin: {
          'border': 'var(--color-border)',
          'table-border': 'var(--color-table-border)',
          'profile-border-hover': 'var(--color-profile-border-hover)',
          'profile-border': 'var( --color-profile-border)',
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

