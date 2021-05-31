import * as vscode from 'vscode';
import * as constants from './constants';
import * as fs from 'fs';
import { CustomProfile } from './models/custom-profile';

export class CustomProfilesProvider implements vscode.TreeDataProvider<CustomProfile> {
  constructor(private context: vscode.ExtensionContext) { }

  onDidChangeTreeData?: vscode.Event<void | CustomProfile | null | undefined> | undefined;
  getTreeItem(element: CustomProfile): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: CustomProfile): vscode.ProviderResult<CustomProfile[]> {
    const rootPath = this.context.globalStorageUri.path;

    // check if dir exists 
    var rootExists = fs.existsSync(rootPath);

    if (!rootExists) { fs.mkdirSync(rootPath); }

    const rootItems = fs.readdirSync(rootPath, { withFileTypes: true });
    const profileNames = rootItems.filter(item => {
      return item.isDirectory();
    })
      .map(item => item.name);

    const profileList = [
      new CustomProfile(`${constants.app}:models.customProfile.default`, 'default', 'System Default', vscode.TreeItemCollapsibleState.None),
      ...profileNames.map(profileName => new CustomProfile(`${constants.app}:models.customProfile.${profileName}`, profileName, '', vscode.TreeItemCollapsibleState.None))
    ];

    return profileList;
  }
}