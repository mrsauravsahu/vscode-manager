import * as vscode from 'vscode'
import * as constants from './constants'
import * as fs from 'fs'
import { CustomProfile } from './models/custom-profile'
import { CustomProfileService } from './services/custom-profile.service'

export class CustomProfilesProvider implements vscode.TreeDataProvider<CustomProfile> {
  constructor(private context: vscode.ExtensionContext,
    private customProfilesService: CustomProfileService) {
    this._onDidChangeTreeData = new vscode.EventEmitter<CustomProfile | undefined | null | void>()
    this.onDidChangeTreeData = this._onDidChangeTreeData.event
  }

  private _onDidChangeTreeData: vscode.EventEmitter<CustomProfile | undefined | null | void>
  readonly onDidChangeTreeData: vscode.Event<CustomProfile | undefined | null | void>

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: CustomProfile): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  getChildren(element?: CustomProfile): vscode.ProviderResult<CustomProfile[]> {
    return this.customProfilesService.getAll()
  }
}