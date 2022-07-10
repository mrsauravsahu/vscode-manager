import * as fs from 'fs'
import * as path from 'path'
import * as process from 'child_process'
import {uniqueNamesGenerator, adjectives, animals} from 'unique-names-generator'
import * as vscode from 'vscode'

import {commands, strings} from '../constants'
import type {Command} from '../types'

export const createProfileCommand: Command = {
  name: commands.createProfile,
  handler: ({provider, services: {extensionMetaService, customProfileService, commandGeneratorService}, treeView}) => async () => {
    const newProfileName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
    })

    const newProfilePath = path.join(extensionMetaService.globalProfilesLocation, newProfileName)

    process.execSync(`mkdir "${newProfilePath}"`)
    const {command: userDataPathCommand, shell} = commandGeneratorService.generateCommand('mkdir', `"${path.join(newProfilePath, 'data', 'User')}"`, {
      Linux: '-p',
      Darwin: '-p',
      Windows_NT: undefined,
    })
    process.execSync(userDataPathCommand, {shell})
    process.execSync(`mkdir "${path.join(newProfilePath, 'extensions')}"`)
    fs.writeFileSync(path.join(newProfilePath, 'data', 'User', 'settings.json'), `{ "window.title": "${newProfileName} — \${activeEditorShort}\${separator}\${rootName}" }`, {encoding: 'utf-8'})

    provider.refresh()
    treeView.message = customProfileService.getAll().length === 0 ? strings.noProfiles : undefined

    await vscode.window.showInformationMessage(`Created new custom profile: '${newProfileName}'`)
  },
}
