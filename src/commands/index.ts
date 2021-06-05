import { copyAliasCommand } from "./copy-alias"
import { createProfileCommand } from "./create-profile"
import { refreshProfilesCommand } from "./refresh-profiles"
import { renameProfileCommand } from "./rename-profile"

export const commands = [
    createProfileCommand,
    copyAliasCommand,
    renameProfileCommand,
    refreshProfilesCommand
]

