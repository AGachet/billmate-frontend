// eslint-rules/no-version-prefix.js
export default {
  rules: {
    'no-version-prefix': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow version prefixes (^, ~) in package.json',
          category: 'Best Practices',
          recommended: true
        },
        schema: []
      },
      create(context) {
        return {
          Property(node) {
            if (node.key.value === 'dependencies' || node.key.value === 'devDependencies') {
              for (const dep of node.value.properties) {
                const version = dep.value.value
                if (version && (version.startsWith('^') || version.startsWith('~'))) {
                  context.report({
                    node: dep.value,
                    message: `Version for "${dep.key.value}" should be fixed (no "^" or "~").`
                  })
                }
              }
            }
          }
        }
      }
    }
  }
}
