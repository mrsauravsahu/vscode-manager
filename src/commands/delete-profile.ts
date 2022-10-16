import * as path from 'path'
import * as child_process from 'child-process-promise'
import * as vscode from 'vscode'

import {commands, profiles, strings} from '../constants'
import {Command} from '../types'
import {CustomProfile} from '../models/custom-profile'

export const deleteProfileCommand: Command = {
  name: commands.deleteProfile,
  handler: ({services: {extensionMetaService, customProfileService, commandGeneratorService}, treeView, provider}) => async (customProfile: CustomProfile) => {
    const {name} = customProfile
    if (name === profiles.default) {
      await vscode.window.showErrorMessage('Cannot delete the default profile')
      return
    }

    const confirmation = await vscode.window.showInformationMessage('Are you sure you want to delete this profile?', 'Yes', 'Cancel')

    if (confirmation === 'Yes') {
      const profilePath = path.join(extensionMetaService.globalProfilesLocation, name)
      const {command: profileDeleteCommand, shell} = commandGeneratorService.generateCommand('rm', `"${path.join(profilePath)}"`, {
        Linux: '-r',
        Darwin: '-r',
        Windows_NT: '-Recurse',
      })
      await child_process.exec(profileDeleteCommand, {shell})
      provider.refresh()

      await vscode.window.showInformationMessage(`Successfully deleted custom profile: '${name}'`)

      if (customProfileService.getAll().length === 0) {
        treeView.message = strings.noProfiles
      }
    }
  },
}
