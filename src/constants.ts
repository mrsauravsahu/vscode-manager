import * as os from 'os'

export const app = 'vscode-manager'

export const rootStoragePath = `${os.homedir()}/.config/${app}`

export const commands = {
  launchProfile: `${app}.commands.launchProfile`,
  selectProfile: `${app}.commands.selectProfile`,
  createProfile: `${app}.commands.createProfile`,
  renameProfile: `${app}.commands.renameProfile`,
  deleteProfile: `${app}.commands.deleteProfile`,
  cloneProfile: `${app}.commands.cloneProfile`,
  refreshProfiles: `${app}.commands.refreshProfiles`,
  copyAlias: `${app}.commands.copyAlias`
}

export const models = {
  profile: `${app}.models.profile`
}

export const profiles = {
  default: 'clean-slate'
}

export const strings = {
  noProfiles: 'No custom profiles found... Let\'s create one now.'
}
