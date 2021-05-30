import * as vscode from 'vscode';
import * as path from 'path';

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = this.label;
    this.description = this.version;
  }

  iconPath = path.join(__dirname, '..', 'resources', 'vscode-icon.svg');
  contextValue = "customProfile";
}

export class CustomProfilesProvider implements vscode.TreeDataProvider<Dependency> {
  constructor(private context: vscode.ExtensionContext) { }

  onDidChangeTreeData?: vscode.Event<void | Dependency | null | undefined> | undefined;
  getTreeItem(element: Dependency): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]> {
    // vscode.window.showInformationMessage(JSON.stringify(`Path: ${this.context.globalStorageUri}`));
    return Promise.resolve([
      new Dependency('Current Profile', 'default', vscode.TreeItemCollapsibleState.None)
    ]);
  }
}