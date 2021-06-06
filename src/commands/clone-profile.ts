import * as child_process from 'child_process'
import * as vscode from 'vscode'

import {commands, rootStoragePath} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command} from '../types'

// TODO: Not fully implemented

export const cloneProfileCommand: Command = {
  name: commands.cloneProfile,
  handler: ({provider}) => (customProfile: CustomProfile) => {
    const {name} = customProfile

    const clonedProfilePath = `${rootStoragePath}/${name}-copy`

    child_process.exec(`mkdir '${clonedProfilePath}'`)

    provider.refresh()
    vscode.window.showInformationMessage(`Cloned profile '${name}' to '${name}-copy'`)
  }
}
