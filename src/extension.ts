// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

import { CustomProfilesProvider } from './custom-profile-tree';
import * as constants from './constants';
import { CustomProfileService } from './services/custom-profile.service';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// TODO: Make rootPath cross platform
	const { rootStoragePath } = constants;
	const customProfileService = new CustomProfileService();
	const customProfilesProvider = new CustomProfilesProvider(context, customProfileService);

	vscode.window.registerTreeDataProvider('customProfiles', customProfilesProvider);
	const customProfilesExplorer = vscode.window.createTreeView('customProfiles', {
		treeDataProvider: customProfilesProvider,
	});

	if (customProfileService.getAll().length === 0) {
		customProfilesExplorer.message = constants.strings.noProfiles;
	}

	vscode.commands.registerCommand('customProfiles.launch', (...args) => {
		// vscode.window.showInformationMessage(JSON.stringify(args));
		const { name } = args[0];

		if (name === 'default') { process.exec('code -n'); }
		else {
			const launchCommand = `code --user-data-dir='${rootStoragePath}/${name}/data' --extensions-dir='${rootStoragePath}/${name}/extensions' -n`;
			process.exec(launchCommand);
		}
	});

	vscode.commands.registerCommand('customProfiles.clone', (...args) => {
		const { name } = args[0];

		const clonedProfilePath = `${rootStoragePath}/${name}-copy`;

		process.exec(`mkdir '${clonedProfilePath}'`);

		customProfilesProvider.refresh();
		vscode.window.showInformationMessage(`Cloned profile '${name}' to '${name}-copy'`);
	});

	vscode.commands.registerCommand('customProfiles.refreshEntry', () => {
		customProfilesProvider.refresh();

		if (customProfileService.getAll().length === 0) {
			customProfilesExplorer.message = constants.strings.noProfiles;
		}
		else {
			customProfilesExplorer.message = undefined;
		}
	});

	vscode.commands.registerCommand('customProfiles.delete', async (...args) => {
		const { name } = args[0];
		if (name === constants.profiles.default) {
			vscode.window.showErrorMessage('Cannot delete the default profile');
			return;
		}

		const confirmation = await vscode.window.showInformationMessage('Are you sure you want to delete this profile?', 'Yes', 'Cancel');

		if (confirmation === 'Yes') {
			const profilePath = path.join(constants.rootStoragePath, name);
			process.exec(`rm -r ${profilePath}`);
			vscode.window.showInformationMessage(`Successfully deleted custom profile: '${name}'`);

			if (customProfileService.getAll().length === 0) {
				customProfilesExplorer.message = constants.strings.noProfiles;
			}
		}
	});

	vscode.commands.registerCommand('customProfiles.rename', async (...args) => {
		const { name } = args[0];

		const value = await vscode.window.showInputBox({
			prompt: 'Rename custom profile to',
			title: 'Rename',
			value: name
		});

		const oldProfilePath = `${rootStoragePath}/${name}`;
		const newProfilePath = `${rootStoragePath}/${value}`;
		process.exec(`mv ${oldProfilePath} ${newProfilePath}`);

		vscode.window.showInformationMessage(`Successfully renamed custom profile: '${value}'`);
	});

	vscode.commands.registerCommand("customProfiles.copyAlias", (...args) => {
		const { name } = args[0];

		const launchCommand = `code --user-data-dir='${rootStoragePath}/${name}/data' --extensions-dir='${rootStoragePath}/${name}/extensions' -n`;
		// TODO: Make platform independent
		const aliasCommand = `alias ${name}-profile='${launchCommand}'`;

		vscode.env.clipboard.writeText(aliasCommand);
		vscode.window.showInformationMessage('Copied alias command to the clipboard');
	});

	vscode.commands.registerCommand("customProfiles.createProfile", () => {
		const newProfileName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			separator: '-'
		});

		const newProfilePath = `${rootStoragePath}/${newProfileName}`;

		process.execSync(`mkdir '${newProfilePath}'`);
		process.execSync(`mkdir -p '${newProfilePath}/data/User'`);
		process.execSync(`mkdir '${newProfilePath}/extensions'`);
		fs.writeFileSync(`${newProfilePath}/data/User/settings.json`, `{ "window.title": "${newProfileName} — \${activeEditorShort}\${separator}\${rootName}" }`, { encoding: 'utf-8' });

		customProfilesProvider.refresh();
		if (customProfileService.getAll().length === 0) {
			customProfilesExplorer.message = constants.strings.noProfiles;
		}
		else {
			customProfilesExplorer.message = undefined;
		}

		vscode.window.showInformationMessage(`Created new custom profile: '${newProfileName}'`);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
