import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as process from 'child_process'
import {uniqueNamesGenerator, adjectives, animals} from 'unique-names-generator'
import * as vscode from 'vscode'

import {commands, rootStoragePath, strings} from '../constants'
import {Command, OSType} from '../types'

export const createProfileCommand: Command = {
  name: commands.createProfile,
  handler: ({provider, services: [customProfileService, ..._], treeView}) => async () => {
    const newProfileName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-'
    })

    const osType: OSType  = os.type() as any

    const newProfilePath = `${rootStoragePath}/${newProfileName}`

    process.execSync(`mkdir "${newProfilePath}"`)
    process.execSync(`mkdir ${osType !== 'Windows_NT' ? '-p': ''} "${path.join(newProfilePath, 'data','User')}"`)
    process.execSync(`mkdir "${path.join(newProfilePath, 'extensions')}"`)
    fs.writeFileSync(path.join(newProfilePath,'data','User','settings.json'), `{ "window.title": "${newProfileName} — \${activeEditorShort}\${separator}\${rootName}" }`, {encoding: 'utf-8'})

    provider.refresh()
    treeView.message = customProfileService.getAll().length === 0 ? strings.noProfiles : undefined

    await vscode.window.showInformationMessage(`Created new custom profile: '${newProfileName}'`)
  }
}
