import * as fs from 'fs-extra'
import * as vscode from 'vscode'
import {ExtensionMetaService} from './extension-meta.service'

export class GlobalStorageLocationCheckService {
  constructor(private readonly context: vscode.ExtensionContext,
    private readonly extensionMetaService: ExtensionMetaService,
  ) {}

  async checkProfilesLocationAsync(): Promise<void> {
    if (fs.existsSync(this.extensionMetaService.globalProfilesLocation)) {
      return
    }

    try {
      await fs.mkdir(this.extensionMetaService.globalProfilesLocation)
      await vscode.window.showInformationMessage(`Created root profiles location at '${this.extensionMetaService.globalProfilesLocation}'.`)
    } catch {
      throw new Error(`Unable to create root location for custom profiles. Please create the folder at '${this.extensionMetaService.globalProfilesLocation}' manually.`)
    }
  }
}
