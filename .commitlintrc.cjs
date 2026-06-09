module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(.*\))?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      presetConfig: {
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'test', section: 'Test' },
          { type: 'chore', section: 'Chores' },
        ],
      },
    },
  },
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'test', 'chore']],
    'scope-enum': [2, 'always', []],
    'subject-empty': [0, 'never'],
  },
};
