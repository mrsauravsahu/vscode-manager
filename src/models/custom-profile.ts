import * as vscode from 'vscode'
import * as path from 'path'

export class CustomProfile extends vscode.TreeItem {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly tag: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(tag, collapsibleState)
    this.tooltip = this.name
    this.label = this.name
    this.description = this.tag
  }

  iconPath = path.join(__dirname, '..', '..', 'resources', 'vscode-icon.svg')
  // TODO: Check later if this needs changing
  contextValue = "customProfile"
}