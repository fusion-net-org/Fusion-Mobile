/**
 * Prettier configuration for the Fusion project.
 * Uses the installed `prettier-plugin-tailwindcss` to sort Tailwind classes.
 */
module.exports = {
  // Formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],
  // If your tailwind config is at the project root, Prettier plugin will detect it automatically.
  tailwindConfig: './tailwind.config.js',

  // Allow Prettier 3 defaults where applicable; this file deliberately keeps only overrides.
};
