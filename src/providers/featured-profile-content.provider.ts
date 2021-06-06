import * as vscode from 'vscode'
import { FeaturedProfileService } from '../services/featured-profile.service';

export class FeaturedProfileContentProvider implements vscode.TextDocumentContentProvider {

    onDidChange?: vscode.Event<vscode.Uri> | undefined;

    constructor(private featuredProfileService: FeaturedProfileService) { }
    async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken) {
        const profile = uri.path
        return await this.featuredProfileService.getProfileDetails(profile)
    }
}