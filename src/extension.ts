// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

import { CustomProfilesProvider } from './custom-profile-tree'
import * as constants from './constants'
import { CustomProfileService } from './services/custom-profile.service'
import { CustomProfile } from './models/custom-profile'
import { CustomProfileDetails } from './types'
import { commands } from './commands'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// TODO: Make rootPath cross platform
	const { rootStoragePath } = constants
	const customProfileService = new CustomProfileService()
	const customProfilesProvider = new CustomProfilesProvider(context, customProfileService)

	vscode.window.registerTreeDataProvider('customProfiles', customProfilesProvider)
	const customProfilesExplorer = vscode.window.createTreeView('customProfiles', {
		treeDataProvider: customProfilesProvider,
	})

	if (customProfileService.getAll().length === 0) {
		customProfilesExplorer.message = constants.strings.noProfiles
	}

	const myProvider = new class implements vscode.TextDocumentContentProvider {

		// emitter and its event
		onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>()
		onDidChange = this.onDidChangeEmitter.event

		async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
			const profileName = uri.path.split('.')[0]
			return await customProfileService.generateProfileJson(profileName)
		}
	}

	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(constants.app, myProvider))

	vscode.commands.registerCommand('customProfiles.launch', async (arg: CustomProfile | { path: string }) => {
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: "Creating Custom Profile",
			cancellable: false
		}, async (progress) => {

			if (arg instanceof CustomProfile) {
				// Custom profile launch
				const { name } = arg

				if (name === 'default') { process.exec('code -n') }
				else {
					const launchCommand = `code --user-data-dir='${rootStoragePath}/${name}/data' --extensions-dir='${rootStoragePath}/${name}/extensions' -n`
					process.execSync(launchCommand)
				}
			} else {
				// Custom profile launch from .json file
				// vscode.window.showInformationMessage(arg.path);
				const { path } = arg

				// Check if this profile file has same value as
				// the generated value from profile name;
				if (!fs.existsSync(path)) { vscode.window.showInformationMessage('Unable to find the custom profile details file.') };

				const profileDetailsString = await fs.promises.readFile(path, { encoding: 'utf-8' })

				let profileDetailsJson = {}
				try {
					profileDetailsJson = JSON.parse(profileDetailsString)
				}
				catch (_) {
					vscode.window.showInformationMessage('The selected profile details file has invalid data. Please use a valid JSON file.')
					return
				}

				// TODO: Validate profileDetailsJson
				// TODO: Add strong type for profile details json 
				const {
					name: profileName,
					userSettings,
					extensions
				} = profileDetailsJson as CustomProfileDetails

				// TODO: Check if profile exists
				const profileExists = fs.existsSync(`${rootStoragePath}/${profileName}`)

				if (!profileExists) {
					vscode.window.showInformationMessage('The selected profile does not exist. Creating it now.')

					progress.report({ increment: 10, message: 'creating Custom Profile folder...' })
					fs.mkdirSync(`${rootStoragePath}/${profileName}`)

					progress.report({ increment: 30, message: 'copying Custom Profile user settings...' })
					process.execSync(`mkdir -p ${rootStoragePath}/${profileName}/data/User`)

					fs.writeFileSync(
						`${rootStoragePath}/${profileName}/data/User/settings.json`,
						JSON.stringify(userSettings, undefined, 2),
						{ encoding: 'utf-8' }
					)

					progress.report({ increment: 50, message: 'installing extensions...' })

					const extensionInstallPromises = extensions.map((extension, index) => new Promise<void>(async resolve => {
						process.execSync(`code --user-data-dir='${rootStoragePath}/${profileName}/data' --extensions-dir='${rootStoragePath}/${profileName}/extensions' --install-extension ${extension}`)
						progress.report({
							increment: 50 + (((index + 1) / extensions.length) / 50), message: `installing extension '${extension}' (${index + 1}/${extensions.length})...`
						})
						resolve()
					}))

					await Promise.all(extensionInstallPromises)

					progress.report({ increment: 100, message: "finished installing extensions..." })
					process.execSync(`code --user-data-dir='${rootStoragePath}/${profileName}/data' --extensions-dir='${rootStoragePath}/${profileName}/extensions' -n`)
					// });
				}
				else {
					const alreadyPresentJsonString = await customProfileService.generateProfileJson(profileName)

					const profileDetailsJsonString = JSON.stringify(profileDetailsJson, undefined, 2)
					if (profileDetailsJsonString === alreadyPresentJsonString) {
						const launchCommand = `code --user-data-dir='${rootStoragePath}/${profileName}/data' --extensions-dir='${rootStoragePath}/${profileName}/extensions' -n`
						process.execSync(launchCommand)
					}
					else {
						vscode.window.showInformationMessage('Please use a different name. Another profile with the same name already exists, but with different settings.')
					}
				}
			}
		})
	})

	// Register commands
	commands.forEach(command => {
		vscode.commands.registerCommand(
			command.name,
			command.handler({
				context,
				provider: customProfilesProvider,
				service: customProfileService,
				treeView: customProfilesExplorer
			})
		)
	})

}

// this method is called when your extension is deactivated
export function deactivate() { }
