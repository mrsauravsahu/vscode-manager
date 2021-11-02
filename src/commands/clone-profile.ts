import * as fs from 'fs'
import * as path from 'path'
import * as child_process from 'child-process-promise'
import * as vscode from 'vscode'

import {commands, rootStoragePath} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command} from '../types'

export const cloneProfileCommand: Command = {
  name: commands.cloneProfile,
  handler: ({provider, services: {commandGeneratorService, commandMetaService}}) => async (customProfile: CustomProfile) => vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Clone',
    cancellable: false,
  }, async progress => {
    const {name} = customProfile
    const currentDate = new Date()
    const cloneProfileName = `${name}-${currentDate.getFullYear()}${currentDate.getMonth().toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getTime()}`

    const originalProfilePath = path.join(rootStoragePath, name)

    const clonedProfilePath = path.join(rootStoragePath, cloneProfileName)

    const createCloneProfileCommand = commandGeneratorService.generateCommand('mkdir', `${clonedProfilePath}/data/User`, {Linux: '-p', Darwin: '-p', Windows_NT: undefined})

    progress.report({increment: 5, message: 'Creating profile folder...'})
    await child_process.exec(createCloneProfileCommand.command, {shell: createCloneProfileCommand.shell})

    await fs.promises.copyFile(path.join(originalProfilePath, 'data', 'User', 'settings.json'),
      path.join(clonedProfilePath, 'data', 'User', 'settings.json'))

    const codeBin = await commandMetaService.getProgramBasedOnMetaAsync('code')

    // Get extensions
    const {command: getExtensionsCommand, shell} = commandGeneratorService.generateCommand(codeBin, `--user-data-dir '${path.join(originalProfilePath, 'data')}' --extensions-dir '${path.join(originalProfilePath, 'extensions')}' --list-extensions`)

    progress.report({increment: 10, message: 'Retrieving extensions from old profile...'})
    const getExtensionsCommandOutput = await child_process.exec(getExtensionsCommand, {shell})
    const extensions = getExtensionsCommandOutput
      .stdout
      .toString()
      .trim()
      .split(/[\n\r]/)
      .filter(p => p.trim() !== '')

    let finishedExtensionCount = 1

    const selectedExtensions = await vscode.window.showQuickPick(extensions, {
      title: 'Please select the extensions you want to clone',
      canPickMany: true,
    }) ?? []

    const installExtensionPromises = selectedExtensions.map(async extension => {
      const {command: extensionInstallCommand, shell} = commandGeneratorService.generateCommand(codeBin, `--user-data-dir '${path.join(clonedProfilePath, 'data')}' --extensions-dir '${path.join(clonedProfilePath, 'extensions')}' --install-extension ${extension}`)

      progress.report({
        increment: 50,
        message: `Installing extension '${extension}' (${finishedExtensionCount}/${selectedExtensions.length}) ...`,
      })

      return child_process.exec(extensionInstallCommand, {shell})
        .then(() => {
          finishedExtensionCount += 1
        })
    })

    await Promise.all(installExtensionPromises)
    provider.refresh()
    progress.report({
      increment: 100,
      message: 'Finished installing extensions.',
    })

    await vscode.window.showInformationMessage(`Cloned profile '${name}' to '${cloneProfileName}'.`)
    return Promise.resolve()
  }),
}
