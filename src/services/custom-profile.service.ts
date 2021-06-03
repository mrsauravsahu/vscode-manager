import * as vscode from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as constants from '../constants';
import { CustomProfile } from '../models/custom-profile';

export class CustomProfileService {
  getAll(): CustomProfile[] {
    const { rootStoragePath } = constants;

    // check if dir exists 
    var rootExists = fs.existsSync(rootStoragePath);

    if (!rootExists) { fs.mkdirSync(rootStoragePath); }

    const rootItems = fs.readdirSync(rootStoragePath, { withFileTypes: true });
    const profileNames = rootItems.filter(item => {
      return item.isDirectory();
    })
      .map(item => item.name);

    const profileList = [
      ...profileNames.map(profileName => {
        const profile = new CustomProfile(`${constants.app}:models.customProfile.${profileName}`,
          profileName,
          '',
          vscode.TreeItemCollapsibleState.None);

        profile.command = {
          command: constants.commands.selectProfile,
          title: "Select Custom Profile",
          arguments: [profile]
        };

        return profile;
      })
    ];

    return profileList;
  }

  generateProfileJson(profileName: string): string {
    const userSettingsPath = `${constants.rootStoragePath}/${profileName}/data/User/settings.json`;

    let userSettingsString = '{}';
    if (fs.existsSync(userSettingsPath)) {
      userSettingsString = fs.readFileSync(userSettingsPath, { encoding: 'utf-8' });
    }

    // Get user settings
    let userSettings = {};
    try {
      userSettings = JSON.parse(userSettingsString)
    } catch (_) { }

    // Get extensions
    const getExtensionsCommandOutput = cp.execSync(`code --user-data-dir='${constants.rootStoragePath}/${profileName}/data' --extensions-dir='${constants.rootStoragePath}/${profileName}/extensions' --list-extensions`)
    const extensions = getExtensionsCommandOutput
      .toString()
      .trim()
      .split(/[\n\r\n]/)
      .filter(p => p.trim() !== '')


    const profile = {
      name: profileName,
      userSettings,
      extensions
    };

    return JSON.stringify(profile, undefined, 2);
  }
}