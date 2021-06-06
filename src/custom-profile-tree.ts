import * as vscode from 'vscode'
import {CustomProfile} from './models/custom-profile'
import {CustomProfileService} from './services/custom-profile.service'

export class CustomProfilesProvider implements vscode.TreeDataProvider<CustomProfile> {
  readonly onDidChangeTreeData: vscode.Event<CustomProfile | undefined | null | void>
  private readonly _onDidChangeTreeData: vscode.EventEmitter<CustomProfile | undefined | null | void>

  constructor(private readonly context: vscode.ExtensionContext,
    private readonly customProfilesService: CustomProfileService) {
    this._onDidChangeTreeData = new vscode.EventEmitter<CustomProfile | undefined | null | void>()
    this.onDidChangeTreeData = this._onDidChangeTreeData.event
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: CustomProfile): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  getChildren(): vscode.ProviderResult<CustomProfile[]> {
    return this.customProfilesService.getAll()
  }
}
