import * as vscode from 'vscode'
import {commands, rootStoragePath} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command} from '../types'

export const copyAliasCommand: Command = {
  name: commands.copyAlias,
  handler: () => (customProfile: CustomProfile) => {
    const {name} = customProfile

    const launchCommand = `code --user-data-dir='${rootStoragePath}/${name}/data' --extensions-dir='${rootStoragePath}/${name}/extensions' -n`
    // TODO: Make platform independent
    const aliasCommand = `alias ${name}-profile='${launchCommand}'`

    vscode.env.clipboard.writeText(aliasCommand)
    vscode.window.showInformationMessage('Copied alias command to the clipboard')
  }
}
