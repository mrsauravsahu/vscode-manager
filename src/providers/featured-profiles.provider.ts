import * as vscode from 'vscode'
import {CustomProfile} from '../models/custom-profile'
import {FeaturedProfileService} from '../services/featured-profile.service'

export class FeaturedProfilesProvider implements vscode.TreeDataProvider<CustomProfile> {
  onDidChangeTreeData?: vscode.Event<void | CustomProfile | null | undefined> | undefined
  onDidChangeTreeDataEmitter: vscode.EventEmitter<void | CustomProfile | null | undefined> | undefined
  featuredProfiles: CustomProfile[]

  constructor(private readonly featuredProfileService: FeaturedProfileService) {
    this.featuredProfiles = []
    this.onDidChangeTreeDataEmitter = new vscode.EventEmitter<void | CustomProfile | null | undefined>()
    this.onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event
  }

  async refresh(): Promise<void> {
    this.featuredProfiles = await this.featuredProfileService.getAll()
    this.onDidChangeTreeDataEmitter?.fire()
  }

  getTreeItem(element: CustomProfile): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  getChildren(): vscode.ProviderResult<CustomProfile[]> {
    return this.featuredProfiles
  }
}
