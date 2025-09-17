module.exports = [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'build/',
      '**/*.ts',
      '**/*.tsx',
    ],
  },
];
