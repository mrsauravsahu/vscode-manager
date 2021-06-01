import * as os from 'os';

export const app = 'vscode-manager';

export const rootStoragePath = `${os.homedir()}/.config/${app}`;

export const commands = {
  launchProfile: `${app}.commands.launchProfile`
};

export const models = {
  profile: `${app}.models.profile`
};