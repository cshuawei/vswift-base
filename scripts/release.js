const shell = require('shelljs')
const inquirer = require('inquirer')
const pkg = require('../package.json')

inquirer.prompt([
  {
    type: 'list',
    name: 'tag',
    message: 'Please Choose a tag:',
    choices: ["latest", "beta", "stable"]
  },
  {
    type: 'list',
    name: 'version',
    message: `Please choose a semver option(current ${pkg.version}):`,
    choices: ["patch", "minor", "major"]
  },
  {
    type: 'confirm',
    name: 'confirm',
    message (answer) {
      return `Are you sure to release the ${answer.version} update?`
    }
  }
]).then(answers => {
  const { tag, version, confirm } = answers
  const { exec } = shell
  if (confirm) {
    exec(`npm version ${version} && npm publish --tag ${tag}`, function (code) {
      if (code !== 0) throw new Error('Release failed')
      console.log('Release success!!! See: https://www.npmjs.com/package/vswift-base')
    })
  }
}).catch(err => {
  console.log(err)
})