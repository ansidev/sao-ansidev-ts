const when = (condition, value, fallback) => (condition ? value : fallback)

const gitHostingList = {
  github: 'git+https://github.com',
  gitlab: 'git+https://gitlab.com',
  bitbucket: 'git+https://bitbucket.org',
}

module.exports = ({ name, version, description, useGitRepo, gitHosting, customRepoUrl, username, author, email }) => {
  const repoUrl = gitHosting === 'other' ? customRepoUrl : `${gitHostingList[gitHosting]}/${username}/${name}`
  const packageMeta = {
    name,
    version,
    description,
    scripts: {
      lint: 'tslint --project tsconfig.json',
      build: 'tsc',
      test: 'jest',
      coverage: 'jest --coverage'
    },
    author: `${author} <${email}>`,
    license: 'MIT',
    dependencies: {
      '@types/jest': '^24.0.17'
    },
    devDependencies: {
      husky: '^3.0.3',
      jest: '^24.8.0',
      'lint-staged': '^9.2.1',
      prettier: '^1.18.2',
      prettier: '^1.18.2',
      'ts-node': '^8.3.0',
      'ts-jest': '^24.0.2',
      tslint: '^5.18.0',
      'tslint-config-prettier': '^1.18.0',
      'tslint-plugin-prettier': '^2.0.1',
      typescript: '^3.5.3'
    },
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    },
    'lint-staged': {
      '!(*(test|spec)).{ts,js}': ['yarn lint --fix', 'git add'],
      '*.{json,md}': [
        'prettier --write',
        'git add',
      ],
    },
  }

  const repository = when(useGitRepo === 'yes', {
    url: `${repoUrl}`,
    type: 'git',
  }, undefined)

  if (typeof repository !== 'undefined') {
    packageMeta['repository'] = repository
  }

  return packageMeta
}
