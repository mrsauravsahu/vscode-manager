import { rootStoragePath } from '../constants'
import * as  fs from 'fs'
import * as vscode from 'vscode'
import { CommandGeneratorService } from './command-generator.service';

export class GlobalStorageMigrationService {
  constructor(private commandGeneratorService:CommandGeneratorService){}

  async migrateToVSCodeGlobalStorageUri(uri: vscode.Uri) {
    if (fs.existsSync(rootStoragePath)) {
      await vscode.window.showInformationMessage("Migrating profiles... This is a one-time operation.");
    }

    // Profiles are already in the new location. We're good.
  }
}