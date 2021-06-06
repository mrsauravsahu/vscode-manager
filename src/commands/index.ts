import {cloneProfileCommand} from './clone-profile'
import {copyAliasCommand} from './copy-alias'
import {createProfileCommand} from './create-profile'
import {deleteProfileCommand} from './delete-profile'
import {refreshProfilesCommand} from './refresh-profiles'
import {renameProfileCommand} from './rename-profile'
import {selectProfileCommand} from './select-profile'
import {launchProfileCommand} from './launch-profile'
import {selectFeaturedProfileCommand} from './select-featured-profile'
import {requestFeaturedProfileCommand} from './request-featured-profile'

export const commands = [
  createProfileCommand,
  copyAliasCommand,
  renameProfileCommand,
  cloneProfileCommand,
  deleteProfileCommand,
  refreshProfilesCommand,
  selectProfileCommand,
  launchProfileCommand,
  selectFeaturedProfileCommand,
  requestFeaturedProfileCommand
]

