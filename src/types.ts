import * as vscode from 'vscode'

import {CustomProfilesProvider} from './custom-profile-tree'
import {CustomProfile} from './models/custom-profile'
import {CommandGeneratorService} from './services/command-generator.service'
import {CustomProfileService} from './services/custom-profile.service'
import {FeaturedProfileService} from './services/featured-profile.service'

export type CustomProfileDetails = {
  name: string;
  userSettings: Record<string, string | any>;
  extensions: string[];
}

export type HandlerArgs = {
  context: vscode.ExtensionContext;
  treeView: vscode.TreeView<CustomProfile>;
  provider: CustomProfilesProvider;
  services: [CustomProfileService, FeaturedProfileService, CommandGeneratorService];
}

export type CommandHandler = ((args: HandlerArgs) => (...args: any[]) => any)

export type Command = {
  name: string;
  handler: CommandHandler;
}

export type OSType = 'Linux' | 'Darwin' | 'Windows_NT'
