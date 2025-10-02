import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const requireJsExtensionInDynamicImportRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require `.js` extension in dynamic imports when using moduleResolution: nodenext',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportExpression(node) {
        const importPath = node.source?.value;
        if (
          typeof importPath === 'string' &&
          (importPath.startsWith('./') || importPath.startsWith('../')) &&
          !importPath.endsWith('.js')
        ) {
          context.report({
            node,
            message:
              'Dynamic imports must include the `.js` extension when using moduleResolution: nodenext.',
          });
        }
      },
    };
  },
};

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      'custom/require-js-extension-in-dynamic-import': 'warn',
    },
  },

  {
    plugins: {
      custom: {
        rules: {
          'require-js-extension-in-dynamic-import':
            requireJsExtensionInDynamicImportRule,
        },
      },
    },
  },
];

export default eslintConfig;
