module.exports = {
    //extends: ['eslint:recommended', 'plugin:react/recommended'],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        //     browser: true,
        //     node: true,
        //     es6: true,
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'windows'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        semi: 'error',
    },
    plugins: ['react'],
};
