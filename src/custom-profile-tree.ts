import * as vscode from 'vscode';
import * as constants from './constants';
import * as fs from 'fs';
import { CustomProfile } from './models/custom-profile';

export class CustomProfilesProvider implements vscode.TreeDataProvider<CustomProfile> {
  constructor(private context: vscode.ExtensionContext) {
    this._onDidChangeTreeData = new vscode.EventEmitter<CustomProfile | undefined | null | void>();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<CustomProfile | undefined | null | void>;
  readonly onDidChangeTreeData: vscode.Event<CustomProfile | undefined | null | void>;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: CustomProfile): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: CustomProfile): vscode.ProviderResult<CustomProfile[]> {
    const { rootStoragePath } = constants;

    // check if dir exists 
    var rootExists = fs.existsSync(rootStoragePath);

    if (!rootExists) { fs.mkdirSync(rootStoragePath); }

    const rootItems = fs.readdirSync(rootStoragePath, { withFileTypes: true });
    const profileNames = rootItems.filter(item => {
      return item.isDirectory();
    })
      .map(item => item.name);

    const profileList = [
      new CustomProfile(`${constants.app}:models.customProfile.default`, constants.profiles.default, '', vscode.TreeItemCollapsibleState.None),
      ...profileNames.map(profileName => new CustomProfile(`${constants.app}:models.customProfile.${profileName}`, profileName, '', vscode.TreeItemCollapsibleState.None))
    ];

    return profileList;
  }
}