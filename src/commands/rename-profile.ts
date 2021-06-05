import * as vscode from 'vscode'
import * as child_process from 'child_process'

import { commands, rootStoragePath } from "../constants"
import { Command } from "../types"

export const renameProfileCommand: Command = {
    name: commands.renameProfile,
    handler: () => async (customProfile) => {
        const { name } = customProfile

        const value = await vscode.window.showInputBox({
            prompt: 'Rename custom profile to',
            title: 'Rename',
            value: name
        })

        const oldProfilePath = `${rootStoragePath}/${name}`
        const newProfilePath = `${rootStoragePath}/${value}`
        child_process.exec(`mv ${oldProfilePath} ${newProfilePath}`)

        vscode.window.showInformationMessage(`Successfully renamed custom profile: '${value}'`)
    }
}