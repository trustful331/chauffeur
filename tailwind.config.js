/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F9BB00',
        maseer: {
          green: '#073A0B',
          'green-deep': '#062111',
          'green-light': '#0a4d18',
          'green-text': '#002703',
          gold: '#C9A130',
          'gold-bright': '#F9BB00',
          'gold-light': '#D4B06A',
          muted: '#6B7280',
          line: '#E8EBE8',
          cream: '#F9F8F3',
          surface: '#F5F6F4',
          'surface-card': 'rgba(7, 58, 11, 0.04)',
          'tint-green': 'rgba(7, 58, 11, 0.05)',
          'tint-contact': 'rgba(27, 48, 34, 0.02)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        lato: ['Lato', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        figma: '1440px',
        page: '1440px',
        content: '1208px',
      },
      borderRadius: {
        '4xl': '2rem',
        figma: '10px',
        'figma-lg': '15.62px',
        'figma-card': '16px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(7, 58, 11, 0.06)',
        card: '0 8px 32px rgba(0, 0, 0, 0.08)',
        float: '0 8px 32px rgba(0, 0, 0, 0.12)',
        booking: '0 8px 32px rgba(0, 0, 0, 0.12)',
        glow: '0 0 0 1px rgba(201, 161, 48, 0.15)',
      },
      dropShadow: {
        float: '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        section: '5rem',
        'section-lg': '6.25rem',
        gutter: '116px',
      },
      fontSize: {
        'figma-hero': ['56px', { lineHeight: '64px', letterSpacing: '0.01em' }],
        'figma-h2': ['45.75px', { lineHeight: '52px' }],
        'figma-h3': ['42px', { lineHeight: '1.15' }],
        'figma-body': ['16px', { lineHeight: '26px' }],
        'figma-sm': ['14px', { lineHeight: '22px' }],
        'figma-xs': ['12px', { lineHeight: '18px' }],
      },
    },
  },
  plugins: [],
}
