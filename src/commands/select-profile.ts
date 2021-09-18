import * as vscode from 'vscode'

import {commands, uriSchemes} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command} from '../types'

export const selectProfileCommand: Command = {
  name: commands.selectProfile,
  handler: () => async (item: CustomProfile) => {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Generating Profile Details',
      cancellable: false,
    }, async progress => {
      progress.report({increment: 10})

      const uri = vscode.Uri.parse(`${uriSchemes.customProfile}:${item.name}.profile.json`)
      const doc = await vscode.workspace.openTextDocument(uri) // Calls back into the provider
      progress.report({increment: 50, message: 'generating profile detail file...'})
      await vscode.window.showTextDocument(doc, {preview: false})
    })
  },
}
