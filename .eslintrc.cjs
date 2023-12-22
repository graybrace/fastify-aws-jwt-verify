/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    ignorePatterns: [
        'dist',
        '.eslintrc.cjs'
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    root: true,
    rules: {
        '@typescript-eslint/no-unused-vars': [ 'error', { 'ignoreRestSiblings': true } ]
    }
};