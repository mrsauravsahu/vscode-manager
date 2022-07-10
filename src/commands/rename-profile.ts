import * as child_process from 'child_process'
import * as path from 'path'
import * as vscode from 'vscode'

import {commands} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command} from '../types'

export const renameProfileCommand: Command = {
  name: commands.renameProfile,
  handler: ({services: {extensionMetaService, commandGeneratorService}}) => async (customProfile: CustomProfile) => {
    const {name} = customProfile

    const value = await vscode.window.showInputBox({
      prompt: 'Rename custom profile to',
      title: 'Rename',
      value: name,
    })

    const oldProfilePath = path.join(extensionMetaService.globalProfilesLocation, name)
    const newProfilePath = path.join(extensionMetaService.globalProfilesLocation, value ?? name)

    const {command: moveProfileCommand, shell} = commandGeneratorService.generateCommand(
      'mv', `${oldProfilePath} ${newProfilePath}`)

    child_process.exec(moveProfileCommand, {shell})

    await vscode.window.showInformationMessage(`Successfully renamed custom profile: '${value}'`)
  },
}
