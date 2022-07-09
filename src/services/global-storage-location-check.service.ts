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
      await vscode.window.showInformationMessage('Creating profiles folder.')
      await fs.mkdir(this.extensionMetaService.globalProfilesLocation, {recursive: true})
      await vscode.window.showInformationMessage(`Created profiles folder at '${this.extensionMetaService.globalProfilesLocation}'.`)
    } catch {
      throw new Error(`Unable to create folder for custom profiles. Please create the folder at '${this.extensionMetaService.globalProfilesLocation}' manually.`)
    }
  }
}
