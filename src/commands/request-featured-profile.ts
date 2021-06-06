import * as vscode from 'vscode'

import { commands } from '../constants'
import { Command } from '../types'

export const requestFeaturedProfileCommand: Command = {
    name: commands.requestFeaturedProfile,
    handler: () => async () => {
        const uri = vscode.Uri.parse('https://github.com/mrsauravsahu/vscode-manager/tree/cool/featured')
        await vscode.env.openExternal(uri)
    }
}
