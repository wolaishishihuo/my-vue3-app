module.exports = {
    extends: [
        'stylelint-config-standard-scss', // SCSS 标准规则
        'stylelint-config-recess-order',  // CSS 属性排序规则
        'stylelint-config-prettier-scss'  // 配合 Prettier 的规则
    ],
    plugins: [
        'stylelint-scss',  // 添加 SCSS 特定规则支持
        'stylelint-order' // 添加属性排序支持
    ],
    rules: {
        // Element Plus 相关规则
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep', 'global']
            }
        ],
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
            }
        ],
        
        // SCSS 相关规则
        'scss/at-rule-no-unknown': true,
        'scss/selector-no-redundant-nesting-selector': true,
        
        // 通用规则
        'no-empty-source': null,
        'no-descending-specificity': null,
        'font-family-no-missing-generic-family-keyword': null,
        
        // 命名规则
        'selector-class-pattern': null,
        'keyframes-name-pattern': null,
        'custom-property-pattern': null,
        
        // 其他规则
        'declaration-block-no-redundant-longhand-properties': null,
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
        'selector-no-vendor-prefix': null,
        'alpha-value-notation': 'number',
        'color-function-notation': 'legacy',
        'import-notation': 'string'
    },
    overrides: [
        {
            files: ['**/*.scss'],
            customSyntax: 'postcss-scss'
        },
        {
            files: ['**/*.vue'],
            customSyntax: 'postcss-html'
        }
    ],
    ignoreFiles: [
        'dist/**/*',
        'node_modules/**/*',
        'public/**/*',
        '**/*.js',
        '**/*.jsx',
        '**/*.tsx',
        '**/*.ts'
    ]
};
  