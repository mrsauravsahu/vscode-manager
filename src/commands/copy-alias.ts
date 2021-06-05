import * as vscode from 'vscode'
import { commands, rootStoragePath } from '../constants'
import { Command } from '../types'

export const copyAliasCommand: Command = {
    name: commands.copyAlias,
    handler: () => () => {
        vscode.commands.registerCommand("customProfiles.copyAlias", (...args) => {
            const { name } = args[0]

            const launchCommand = `code --user-data-dir='${rootStoragePath}/${name}/data' --extensions-dir='${rootStoragePath}/${name}/extensions' -n`
            // TODO: Make platform independent
            const aliasCommand = `alias ${name}-profile='${launchCommand}'`

            vscode.env.clipboard.writeText(aliasCommand)
            vscode.window.showInformationMessage('Copied alias command to the clipboard')
        })
    }
}
