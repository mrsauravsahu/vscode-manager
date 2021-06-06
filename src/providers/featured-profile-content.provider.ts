import * as vscode from 'vscode'
import {FeaturedProfileService} from '../services/featured-profile.service'

export class FeaturedProfileContentProvider implements vscode.TextDocumentContentProvider {
  onDidChange?: vscode.Event<vscode.Uri> | undefined

  constructor(private readonly featuredProfileService: FeaturedProfileService) {}
  async provideTextDocumentContent(uri: vscode.Uri) {
    const profile = uri.path
    return this.featuredProfileService.getProfileDetails(profile)
  }
}
