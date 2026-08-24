const js = require('@eslint/js');

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  location: 'readonly',
  WebSocket: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  requestAnimationFrame: 'readonly',
};

module.exports = [
  js.configs.recommended,
  {
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable' },
    },
  },
  {
    files: ['server/**/*.js'],
    ignores: ['server/lib/__tests__/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      eqeqeq: 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_|^err$' }],
    },
  },
  {
    files: ['server/lib/__tests__/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
      },
    },
  },
  // Each client/js/*.js file below defines exactly one of these globals via an
  // IIFE (e.g. `const Network = (() => {...})()`); the others are declared
  // readonly here because index.html loads the scripts in dependency order.
  {
    files: ['client/js/network.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: browserGlobals },
    rules: { eqeqeq: 'error' },
  },
  {
    files: ['client/js/state.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: browserGlobals },
    rules: { eqeqeq: 'error' },
  },
  {
    files: ['client/js/renderer.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: browserGlobals },
    rules: { eqeqeq: 'error' },
  },
  {
    files: ['client/js/input.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: browserGlobals },
    rules: { eqeqeq: 'error' },
  },
  {
    files: ['client/js/ui.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: browserGlobals },
    rules: { eqeqeq: 'error' },
  },
  {
    files: ['client/js/main.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...browserGlobals,
        Network: 'readonly',
        ClientState: 'writable',
        Renderer: 'readonly',
        InputHandler: 'readonly',
        UI: 'readonly',
      },
    },
    rules: { eqeqeq: 'error' },
  },
];
