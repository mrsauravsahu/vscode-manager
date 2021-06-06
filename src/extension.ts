// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import {CustomProfilesProvider} from './custom-profile-tree'
import * as constants from './constants'
import {CustomProfileService} from './services/custom-profile.service'
import {commands} from './commands'

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // TODO: Make rootPath cross platform
  const customProfileService = new CustomProfileService()
  const customProfilesProvider = new CustomProfilesProvider(context, customProfileService)

  vscode.window.registerTreeDataProvider('customProfiles', customProfilesProvider)
  const customProfilesExplorer = vscode.window.createTreeView('customProfiles', {
    treeDataProvider: customProfilesProvider
  })

  if (customProfileService.getAll().length === 0) {
    customProfilesExplorer.message = constants.strings.noProfiles
  }

  const myProvider = new class implements vscode.TextDocumentContentProvider {
    // Emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>()
    onDidChange = this.onDidChangeEmitter.event

    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
      const profileName = uri.path.split('.')[0]
      return customProfileService.generateProfileJson(profileName)
    }
  }()

  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(constants.app, myProvider))

  customProfilesProvider.refresh()

  // Register commands
  for (const command of commands) {
    vscode.commands.registerCommand(
      command.name,
      command.handler({
        context,
        provider: customProfilesProvider,
        service: customProfileService,
        treeView: customProfilesExplorer
      })
    )
  }
}
