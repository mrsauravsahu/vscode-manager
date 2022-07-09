import * as fs from 'fs'
import * as path from 'path'
import * as child_process from 'child-process-promise'
import * as vscode from 'vscode'
import * as json5 from 'json5'
import * as constants from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {CommandGeneratorService} from './command-generator.service'
import {CommandMetaService} from './command-meta.service'
import {ExtensionMetaService} from './extension-meta.service'

export class CustomProfileService {
  public constructor(private readonly extensionMetaService: ExtensionMetaService,
    private readonly commandGeneratorService: CommandGeneratorService,
    private readonly commandMetaService: CommandMetaService) {}

  getAll(): CustomProfile[] {
    const rootItems = fs.readdirSync(this.extensionMetaService.globalProfilesLocation, {withFileTypes: true})
    const profileNames = rootItems.filter(item => item.isDirectory())
      .map(item => item.name)

    const profileList = [
      ...profileNames.map(profileName => {
        const profile = new CustomProfile(`${constants.app}:models.customProfile.${profileName}`,
          profileName,
          '',
          vscode.TreeItemCollapsibleState.None)

        profile.command = {
          command: constants.commands.selectProfile,
          title: 'Select Custom Profile',
          arguments: [profile],
        }

        return profile
      }),
    ]

    return profileList
  }

  async generateProfileJson(profileName: string): Promise<string> {
    const userSettingsPath = path.join(this.extensionMetaService.globalProfilesLocation, profileName, 'data', 'User', 'settings.json')

    let userSettingsString = '{}'
    if (fs.existsSync(userSettingsPath)) {
      userSettingsString = await fs.promises.readFile(userSettingsPath, {encoding: 'utf-8'})
    }

    // Get user settings
    let userSettings = {}
    try {
      userSettings = json5.parse(userSettingsString)
    } catch {
      await vscode.window.showInformationMessage('The profile contains invalid user settings.')
    }

    const codeBin = await this.commandMetaService.getProgramBasedOnMetaAsync('code')

    // Get extensions
    const {command: getExtensionsCommand, shell} = this.commandGeneratorService.generateCommand(codeBin, `--user-data-dir '${path.join(this.extensionMetaService.globalProfilesLocation, profileName, 'data')}' --extensions-dir '${path.join(this.extensionMetaService.globalProfilesLocation, profileName, 'extensions')}' --list-extensions`)
    const getExtensionsCommandOutput = await child_process.exec(getExtensionsCommand, {shell})
    const extensions = getExtensionsCommandOutput
      .stdout
      .toString()
      .trim()
      .split(/[\n\r]/)
      .filter(p => p.trim() !== '')

    const profile = {
      name: profileName,
      userSettings,
      extensions,
    }

    return JSON.stringify(profile, undefined, 2)
  }
}
