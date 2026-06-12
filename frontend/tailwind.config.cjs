/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#005026',
        'primary-container': '#006b35',
        'primary-fixed': '#9cf6b1',
        'primary-fixed-dim': '#81d997',
        secondary: '#745b00',
        'secondary-container': '#fdcc14',
        'secondary-fixed': '#ffe08b',
        'secondary-fixed-dim': '#f1c100',
        tertiary: '#005028',
        'tertiary-container': '#23693d',
        'tertiary-fixed': '#abf3bb',
        'tertiary-fixed-dim': '#90d6a0',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        background: '#faf9f6',
        surface: '#faf9f6',
        'surface-dim': '#d2daef',
        'surface-bright': '#f9f9ff',
        'surface-container': '#e8eeff',
        'surface-container-low': '#f1f3ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e0e8fd',
        'surface-container-highest': '#dbe2f8',
        'surface-variant': '#dbe2f8',
        outline: '#6f7a6f',
        'outline-variant': '#becabd',
        'on-background': '#141c2b',
        'on-surface': '#141c2b',
        'on-surface-variant': '#3f4940',
        'on-primary': '#ffffff',
        'on-primary-container': '#8fe9a5',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#6e5700',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#9ee6af',
        'on-tertiary-fixed': '#00210d',
        'on-tertiary-fixed-variant': '#025229',
        'on-error': '#ffffff',
        'on-error-container': '#93000a'
      },
      spacing: {
        unit: '4px',
        'margin-tablet': '32px',
        'container-max': '1280px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '64px'
      },
      maxWidth: {
        'container-max': '1280px'
      },
      fontFamily: {
        'display-lg': ['Playfair Display', 'serif'],
        'display-lg-mobile': ['Playfair Display', 'serif'],
        'headline-md': ['Playfair Display', 'serif'],
        'headline-sm': ['Playfair Display', 'serif'],
        'label-uppercase': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif']
      },
      fontSize: {
        'display-lg-mobile': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'label-uppercase': ['12px', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.5' }],
        'body-sm': ['14px', { lineHeight: '1.4' }],
        'headline-md': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-sm': ['24px', { lineHeight: '1.3', fontWeight: '600' }]
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
