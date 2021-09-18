import * as fs from 'fs'
import * as child_process from 'child_process'
import * as vscode from 'vscode'
import * as json5 from 'json5'
import * as constants from '../constants'
import {CustomProfile} from '../models/custom-profile'

export class CustomProfileService {
  getAll(): CustomProfile[] {
    const {rootStoragePath} = constants

    // Check if dir exists
    const rootExists = fs.existsSync(rootStoragePath)

    if (!rootExists) {
      fs.mkdirSync(rootStoragePath)
    }

    const rootItems = fs.readdirSync(rootStoragePath, {withFileTypes: true})
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
    const userSettingsPath = `${constants.rootStoragePath}/${profileName}/data/User/settings.json`

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

    // Get extensions
    const getExtensionsCommandOutput = child_process.execSync(`code --user-data-dir='${constants.rootStoragePath}/${profileName}/data' --extensions-dir='${constants.rootStoragePath}/${profileName}/extensions' --list-extensions`)
    const extensions = getExtensionsCommandOutput
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
