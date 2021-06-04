import * as vscode from 'vscode'

import { CustomProfilesProvider } from "./custom-profile-tree"
import { CustomProfile } from './models/custom-profile'
import { CustomProfileService } from "./services/custom-profile.service"

export type CustomProfileDetails = {
    name: string
    userSettings: Record<string, string | any>
    extensions: string[]
}

export type HandlerArgs = {
    context: vscode.ExtensionContext,
    treeView: vscode.TreeView<CustomProfile>,
    provider: CustomProfilesProvider,
    service: CustomProfileService
}

export type CommandHandler = ((args: HandlerArgs) => (...args: any[]) => any)
