const superb = require('superb')
const updatePackage = require('./lib/update-pkg')

module.exports = {
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'version',
        message: 'What is the version of the new project',
        default: '1.0.0'
      },
      {
        name: 'description',
        message: 'How would you describe the new project',
        default: `My ${superb.random()} project`
      },
      {
        name: 'useGitRepo',
        message: 'Do you use git repository for this package',
        type: 'list',
        choices: [
          {
            name: 'Yes',
            value: true
          },
          {
            name: 'No',
            value: false
          }
        ],
        default: 'yes'
      },
      {
        name: 'gitHosting',
        message: 'Which is the git hosting you are using',
        type: 'list',
        choices: [
          {
            name: 'GitHub',
            value: 'github'
          },
          {
            name: 'GitLab',
            value: 'gitlab'
          },
          {
            name: 'Bitbucket',
            value: 'bitbucket'
          },
          {
            name: 'Other',
            value: 'other'
          }
        ],
        default: 'github',
        when: answers => answers.useGitRepo,
      },
      {
        name: 'customRepoUrl',
        message: 'Enter your customRepoUrl',
        when: answers => answers.gitHosting === 'other',
        store: true
      },
      {
        name: 'author',
        message: 'What is your name',
        default: this.gitUser.name,
        store: true
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username,
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true
      },
      {
        name: 'website',
        message: 'The URL of your website',
        default({ username }) {
          return `https://github.com/${username}`
         },
        store: true
      }
    ]
  },
  actions() {
    const answers = this.answers
    return [
      {
        type: 'add',
        files: '**'
      },
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          '_package.json': 'package.json'
        }
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: (data, filepath) => updatePackage(answers),
      },
    ]
  },
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  }
}
