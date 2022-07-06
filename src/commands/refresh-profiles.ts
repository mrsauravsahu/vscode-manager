import {commands, strings} from '../constants'
import {Command} from '../types'

export const refreshProfilesCommand: Command = {
  name: commands.refreshProfiles,
  handler: ({treeView, provider, services: {customProfileService}}) => () => {
    provider.refresh()

    treeView.message = customProfileService.getAll().length === 0 ? strings.noProfiles : undefined
  },
}
