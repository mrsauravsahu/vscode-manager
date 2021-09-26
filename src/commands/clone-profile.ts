import * as child_process from 'child-process-promise'
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

import { commands, rootStoragePath } from '../constants'
import { CustomProfile } from '../models/custom-profile'
import { Command } from '../types'

// TODO: Not fully implemented

export const cloneProfileCommand: Command = {
  name: commands.cloneProfile,
  handler: ({ provider, services: [_, __, commandGeneratorService] }) => async (customProfile: CustomProfile) => await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Launching Custom Profile',
    cancellable: false
  }, async progress => {
    const { name } = customProfile

    const originalProfilePath = path.join(rootStoragePath, name)
    const clonedProfilePath = path.join(rootStoragePath, `${name}-copy`)

    const createCloneProfileCommand = commandGeneratorService.generateCommand('mkdir', `${clonedProfilePath}/data/User`, { Linux: '-p', Darwin: '-p', Windows_NT: undefined })

    progress.report({ increment: 5, message: 'Creating profile folder...' });
    await child_process.exec(createCloneProfileCommand.command, { shell: createCloneProfileCommand.shell })

    await fs.promises.copyFile(path.join(originalProfilePath, 'data', 'User', 'settings.json'),
      path.join(clonedProfilePath, 'data', 'User', 'settings.json'))

    // Get extensions
    const { command: getExtensionsCommand, shell } = commandGeneratorService.generateCommand('code', `--user-data-dir '${path.join(originalProfilePath, 'data')}' --extensions-dir '${path.join(clonedProfilePath, 'extensions')}' --list-extensions`)

    progress.report({ increment: 10, message: 'Retrieving extensions from old profile...' });
    const getExtensionsCommandOutput = await child_process.exec(getExtensionsCommand, { shell })
    const extensions = getExtensionsCommandOutput
      .stdout
      .toString()
      .trim()
      .split(/[\n\r]/)
      .filter(p => p.trim() !== '')
    

    const installExtensionPromises = extensions.map(async (extension, index) => new Promise<void>(async (resolve) => {
      const { command: extensionInstallCommand, shell } = commandGeneratorService.generateCommand('code', `--user-data-dir '${path.join(clonedProfilePath, 'data')}' --extensions-dir '${path.join(clonedProfilePath, 'extensions')}' --install-extension ${extension}`)

      await child_process.exec(extensionInstallCommand, { shell })

      progress.report({
        increment: 50 / extensions.length * 90,
        message: `Installed extension '${extension}'...`
      })

      resolve()
    }))

    await Promise.all(installExtensionPromises)

    provider.refresh()
  }),
}
