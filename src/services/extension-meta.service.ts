import * as vscode from 'vscode'
import {rootStoragePath} from '../constants'

export class ExtensionMetaService {
  constructor(private readonly context: vscode.ExtensionContext) {}

  get globalProfilesLocation(): string {
    return rootStoragePath
  }
}
