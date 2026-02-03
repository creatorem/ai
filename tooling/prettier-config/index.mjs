/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig } */
const config = {
    tabWidth: 4,
    printWidth: 110,
    semi: true,
    trailingComma: 'es5',
    useTabs: false,
    arrowParens: 'always',
    singleQuote: true,
    jsxSingleQuote: false,
    bracketSpacing: true,
    importOrder: [
        '/^(?!.*\\.css).*/',
        '^server-only$',
        '^react$',
        '^react-dom$',
        '^next$',
        '^next/(.*)$',
        '^@supabase/supabase-js$',
        '^@supabase/gotrue-js$',
        '<THIRD_PARTY_MODULES>',
        '^@kit/(.*)$', // package imports
        '^~/(.*)$', // app-specific imports
        '^[./]', // relative imports
    ],
    tailwindFunctions: ['tw', 'clsx', 'cn', 'cva'],
    importOrderSortSpecifiers: true,
    importOrderSeparation: true,
    plugins: [
        '@trivago/prettier-plugin-sort-imports',
        'prettier-plugin-organize-imports',
        'prettier-plugin-tailwindcss',
    ],
};

export default config;
