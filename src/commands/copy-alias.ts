import * as vscode from 'vscode'
import {commands} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command} from '../types'

export const copyAliasCommand: Command = {
  name: commands.copyAlias,
  handler: ({services: {extensionMetaService}}) => async (customProfile: CustomProfile) => {
    const {name} = customProfile

    const launchCommand = `code --user-data-dir '${extensionMetaService.globalProfilesLocation}/${name}/data' --extensions-dir '${extensionMetaService.globalProfilesLocation}/${name}/extensions' -n`
    // TODO: Make platform independent
    const aliasCommand = `alias ${name}-profile='${launchCommand}'`

    await vscode.env.clipboard.writeText(aliasCommand)
    await vscode.window.showInformationMessage('Copied alias command to the clipboard')
  },
}
