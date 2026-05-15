// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // TypeScript & Vue files
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }]
    }
  },

  // Vue-specific
  {
    files: ['**/*.vue'],
    rules: {
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/define-macros-order': ['error', {
        order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
      }],
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': ['error', {
        html: { void: 'always', normal: 'always', component: 'always' }
      }],
      'vue/attributes-order': ['error', { alphabetical: false }],
      'vue/no-unused-refs': 'error',
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/no-deprecated-slot-attribute': 'off'
    }
  },

  // All files
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'object-shorthand': ['error', 'always'],
      'no-nested-ternary': 'error',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }]
    }
  }
)
