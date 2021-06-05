import { cloneProfileCommand } from "./clone-profile"
import { copyAliasCommand } from "./copy-alias"
import { createProfileCommand } from "./create-profile"
import { deleteProfileCommand } from "./delete-profile"
import { refreshProfilesCommand } from "./refresh-profiles"
import { renameProfileCommand } from "./rename-profile"

export const commands = [
    createProfileCommand,
    copyAliasCommand,
    renameProfileCommand,
    cloneProfileCommand,
    deleteProfileCommand,
    refreshProfilesCommand
]

