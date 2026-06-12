module.exports = {
  root: true,
  ignorePatterns: ['dist/', 'node_modules/'],
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['react-refresh'],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    'react-refresh/only-export-components': 'off',
    'no-inner-declarations': 'off',
    'no-unused-vars': 'off'
  },
  overrides: [
    {
      files: [
        'src/components/landing/**/*.{js,jsx}',
        'src/data/**/*.js',
        'src/hooks/**/*.js',
        'src/utils/**/*.js',
        'src/components/Navbar.jsx',
        'src/components/Footer.jsx',
        'src/components/PublicLayout.jsx'
      ],
      rules: {
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
      }
    }
  ]
};
