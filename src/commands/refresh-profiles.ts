import { commands, strings } from "../constants"
import { Command } from "../types"


export const refreshProfilesCommand: Command = {
    name: commands.refreshProfiles,
    handler: ({ treeView, provider, service }) => () => {
        provider.refresh()

        if (service.getAll().length === 0) {
            treeView.message = strings.noProfiles
        }
        else {
            treeView.message = undefined
        }
    }
}