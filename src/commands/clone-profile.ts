import * as vscode from 'vscode'
import * as child_process from 'child_process'

import { commands, rootStoragePath } from "../constants"
import { Command } from "../types"

// TODO: Not fully implemented

export const cloneProfileCommand: Command = {
    name: commands.cloneProfile,
    handler: ({ provider }) => (customProfile) => {
        const { name } = customProfile

        const clonedProfilePath = `${rootStoragePath}/${name}-copy`

        child_process.exec(`mkdir '${clonedProfilePath}'`)

        provider.refresh()
        vscode.window.showInformationMessage(`Cloned profile '${name}' to '${name}-copy'`)
    }
}