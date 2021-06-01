import * as vscode from 'vscode';
import * as fs from 'fs';
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
      ...profileNames.map(profileName => new CustomProfile(`${constants.app}:models.customProfile.${profileName}`, profileName, '', vscode.TreeItemCollapsibleState.None))
    ];

    return profileList;
  }
}