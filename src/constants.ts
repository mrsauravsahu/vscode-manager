import * as os from 'os'

export const app = 'vscode-manager'

export const rootStoragePath = `${os.homedir()}/.config/${app}`

export const commands = {
  launchProfile: `${app}.commands.launchProfile`,
  selectProfile: `${app}.commands.selectProfile`
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