// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import {CustomProfilesProvider} from './custom-profile-tree'
import * as constants from './constants'
import {CustomProfileService} from './services/custom-profile.service'
import {commands} from './commands'
import {FeaturedProfileService} from './services/featured-profile.service'
import {FeaturedProfilesProvider} from './providers/featured-profiles.provider'
import {FeaturedProfileContentProvider} from './providers/featured-profile-content.provider'
import {CommandGeneratorService} from './services/command-generator.service'
import {ExtensionMetaService} from './services/extension-meta.service'
import {GlobalStorageLocationCheckService} from './services/global-storage-location-check.service'

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // TODO: Make rootPath cross platform
  // TODO: Use a DI container to register and use dependencies
  const extensionMetaService = new ExtensionMetaService(context)

  await (new GlobalStorageLocationCheckService(context, extensionMetaService)
    .checkProfilesLocationAsync())

  const commandGeneratorService = new CommandGeneratorService()
  const customProfileService = new CustomProfileService(extensionMetaService, commandGeneratorService)
  const customProfilesProvider = new CustomProfilesProvider(context, customProfileService)

  vscode.window.registerTreeDataProvider('customProfiles', customProfilesProvider)
  const customProfilesExplorer = vscode.window.createTreeView('customProfiles', {
    treeDataProvider: customProfilesProvider,
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

  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(constants.uriSchemes.customProfile, myProvider))

  // Refresh all custom profiles explorer
  customProfilesProvider.refresh()

  /* FEATURED PROFILES SECTION */
  const featuredProfileService = new FeaturedProfileService()
  const featuredProfilesProvider = new FeaturedProfilesProvider(featuredProfileService)
  vscode.window.createTreeView(constants.views.featuredProfiles, {
    treeDataProvider: featuredProfilesProvider,
  })

  await featuredProfilesProvider.refresh()

  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(constants.uriSchemes.featuredProfile,
    new FeaturedProfileContentProvider(featuredProfileService),
  ))

  // Register commands
  for (const command of commands) {
    vscode.commands.registerCommand(
      command.name,
      command.handler({
        context,
        provider: customProfilesProvider,
        services: {
          extensionMetaService,
          customProfileService,
          featuredProfileService,
          commandGeneratorService,
        },
        treeView: customProfilesExplorer,
      }),
    )
  }
}
