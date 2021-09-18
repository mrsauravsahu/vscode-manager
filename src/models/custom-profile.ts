import * as path from 'path'
import * as vscode from 'vscode'

export class CustomProfile extends vscode.TreeItem {
  // TODO: Check later if this needs changing
  contextValue = 'customProfile'

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly tag: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    iconPath?: string,
  ) {
    super(tag, collapsibleState)
    this.tooltip = this.name
    this.label = this.name
    this.description = this.tag

    this.iconPath = iconPath ?? path.join(__dirname, '..', '..', 'resources', 'vscode-icon.svg')
  }
}
