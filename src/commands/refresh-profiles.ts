import {commands, strings} from '../constants'
import {Command} from '../types'

export const refreshProfilesCommand: Command = {
  name: commands.refreshProfiles,
  handler: ({treeView, provider, service}) => () => {
    provider.refresh()

    treeView.message = service.getAll().length === 0 ? strings.noProfiles : undefined
  },
}
