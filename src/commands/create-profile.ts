import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator'
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as process from 'child_process'

import { commands, rootStoragePath, strings } from "../constants"
import { Command } from "../types"

export const createProfileCommand: Command = {
    name: commands.createProfile,
    handler: ({ provider, service, treeView }) => () => {
        const newProfileName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: '-'
        })

        const newProfilePath = `${rootStoragePath}/${newProfileName}`

        process.execSync(`mkdir '${newProfilePath}'`)
        process.execSync(`mkdir -p '${newProfilePath}/data/User'`)
        process.execSync(`mkdir '${newProfilePath}/extensions'`)
        fs.writeFileSync(`${newProfilePath}/data/User/settings.json`, `{ "window.title": "${newProfileName} — \${activeEditorShort}\${separator}\${rootName}" }`, { encoding: 'utf-8' })

        provider.refresh()
        if (service.getAll().length === 0) {
            treeView.message = strings.noProfiles
        }
        else {
            treeView.message = undefined
        }

        vscode.window.showInformationMessage(`Created new custom profile: '${newProfileName}'`)
    }
}