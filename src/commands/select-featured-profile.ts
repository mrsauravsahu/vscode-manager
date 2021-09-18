import * as vscode from 'vscode'

import {commands, uriSchemes} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command} from '../types'

export const selectFeaturedProfileCommand: Command = {
  name: commands.selectFeaturedProfile,
  handler: () => async (item: CustomProfile) => {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Retrieving Profile Details',
      cancellable: false,
    }, async progress => {
      progress.report({increment: 10})

      const uri = vscode.Uri.parse(`${uriSchemes.featuredProfile}:${item.name}.json`)
      const doc = await vscode.workspace.openTextDocument(uri) // Calls back into the provider
      progress.report({increment: 50, message: 'retrieving profile detail file...'})
      await vscode.window.showTextDocument(doc, {preview: false})
    })
  },
}
