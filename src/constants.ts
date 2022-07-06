import * as os from 'os'
import * as path from 'path'

export const app = 'vscode-manager'

export const rootStoragePath = path.join(os.homedir(), '.config', app)

export const commands = {
  launchProfile: `${app}.commands.launchProfile`,
  selectProfile: `${app}.commands.selectProfile`,
  selectFeaturedProfile: `${app}.commands.selectFeaturedProfile`,
  createProfile: `${app}.commands.createProfile`,
  renameProfile: `${app}.commands.renameProfile`,
  deleteProfile: `${app}.commands.deleteProfile`,
  cloneProfile: `${app}.commands.cloneProfile`,
  refreshProfiles: `${app}.commands.refreshProfiles`,
  requestFeaturedProfile: `${app}.commands.requestFeaturedProfile`,
  copyAlias: `${app}.commands.copyAlias`,
}

export const views = {
  featuredProfiles: `${app}.views.treeViews.featuredProfiles`,
}

export const models = {
  profile: `${app}.models.profile`,
}

export const profiles = {
  default: 'clean-slate',
}

export const strings = {
  noProfiles: 'No custom profiles found... Let\'s create one now.',
}

export const uriSchemes = {
  customProfile: `${app}.uri.customProfile`,
  featuredProfile: `${app}.uri.featuredProfile`,
}

export const featuredProfileUrl = 'http://api.github.com/repos/mrsauravsahu/vscode-manager/contents/featured'
