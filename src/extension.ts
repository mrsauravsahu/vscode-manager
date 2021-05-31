// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CustomProfilesProvider } from './custom-profile-tree';
import * as process from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('customProfiles', new CustomProfilesProvider(context));

	vscode.commands.registerCommand('customProfiles.launch', (...args) => {
		// vscode.window.showInformationMessage(JSON.stringify(args));
		const { name } = args[0];
		const rootPath = context.globalStorageUri.path;
		if (name === 'default') { process.exec('code -n'); }
		else {
			const launchCommand = `code --user-data-dir='${rootPath}/${name}/data' --extensions-dir='${rootPath}/${name}/extensions' -n`;
			vscode.window.showInformationMessage(launchCommand);
			process.exec(launchCommand);
		}
	});

	vscode.commands.registerCommand('customProfiles.clone', (...args) => {

		const { name } = args[0];
		const rootPath = context.globalStorageUri.path;

		const clonedProfilePath = `${rootPath}/${name}-copy`;
		vscode.window.showInformationMessage(clonedProfilePath);

		process.exec(`mkdir '${clonedProfilePath}'`);

		process.exec(`open ${clonedProfilePath}`);

		vscode.window.showInformationMessage(`Cloned profile '${name}' to '${name}-copy'`);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
