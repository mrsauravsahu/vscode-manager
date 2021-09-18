import * as fs from 'fs'
import * as path from 'path'
import * as child_process from 'child-process-promise'
import * as vscode from 'vscode'

import { commands, rootStoragePath } from '../constants'
import { CustomProfile } from '../models/custom-profile'
import { Command, CustomProfileDetails } from '../types'

export const launchProfileCommand: Command = {
  name: commands.launchProfile,
  handler: ({ services: [customProfileService, _, commandGeneratorService] }) => (arg: CustomProfile | { fsPath: string }) => vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Launching Custom Profile',
    cancellable: false
  }, async progress => {
    if (arg instanceof CustomProfile) {
      // Custom profile launch
      const { name } = arg

      if (name === 'default') {
        await child_process.exec('code -n')
      } else {
        const { command: launchCommand, shell } = commandGeneratorService.generateCommand('code',
          `--user-data-dir '${path.join(rootStoragePath, name, 'data')}' --extensions-dir '${path.join(rootStoragePath, name, 'extensions')}' -n`)
        await child_process.exec(launchCommand, { shell });
      }
    } else {
      // Custom profile launch from .json file
      // vscode.window.showInformationMessage(arg.path);
      const { fsPath: profilePath } = arg

      // Check if this profile file has same value as
      // the generated value from profile name;
      if (!fs.existsSync(profilePath)) {
        await vscode.window.showInformationMessage('Unable to find the custom profile details file.')
      }

      const profileDetailsString = await fs.promises.readFile(profilePath, { encoding: 'utf-8' })

      let profileDetailsJson: any = {}
      try {
        profileDetailsJson = JSON.parse(profileDetailsString)
      } catch {
        await vscode.window.showInformationMessage('The selected profile details file has invalid data. Please use a valid JSON file.')
        return
      }

      // TODO: Validate profileDetailsJson
      // TODO: Add strong type for profile details json
      const {
        name: profileName,
        userSettings,
        extensions
      } = profileDetailsJson as CustomProfileDetails

      const profileRootPath = path.join(rootStoragePath, profileName)
      // TODO: Check if profile exists
      const profileExists = fs.existsSync(profileRootPath)

      if (!profileExists) {
        // Await vscode.window.showInformationMessage('The selected profile does not exist. Creating it now.')

        progress.report({ increment: 10, message: 'creating Custom Profile folder...' })
        await fs.promises.mkdir(profileRootPath)

        progress.report({ increment: 30, message: 'copying Custom Profile user settings...' })

        const { command: createDirCommand, shell } = commandGeneratorService.generateCommand('mkdir',
          path.join(rootStoragePath, profileName, 'data', 'User'), {
          Linux: '-p',
          Darwin: '-p',
          Windows_NT: undefined
        })
        await child_process.exec(createDirCommand, { shell })

        await fs.promises.writeFile(
          path.join(rootStoragePath, profileName, 'data', 'User', 'settings.json'),
          JSON.stringify(userSettings, undefined, 2),
          { encoding: 'utf-8' }
        )

        progress.report({ increment: 50, message: 'installing extensions...' })

        const installExtensionPromises = extensions.map(async extension => {
          const { command: extensionInstallCommand, shell } = commandGeneratorService.generateCommand('code', `--user-data-dir '${path.join(rootStoragePath, profileName, 'data')}' --extensions-dir '${path.join(rootStoragePath, profileName, 'extensions')}' --install-extension ${extension}`)

          return child_process.exec(extensionInstallCommand, { shell })
        })

        await Promise.all(installExtensionPromises)

        const launchCommand
          = commandGeneratorService.generateCommand('code', `--user-data-dir '${path.join(rootStoragePath, profileName, 'data')}' --extensions-dir '${path.join(rootStoragePath, profileName, 'extensions')}' -n`)

        await child_process.exec(launchCommand.command, { shell: launchCommand.shell })
      } else {
        const alreadyPresentJsonString = await customProfileService.generateProfileJson(profileName)

        const profileDetailsJsonString = JSON.stringify(profileDetailsJson, undefined, 2)
        if (profileDetailsJsonString === alreadyPresentJsonString) {
          const launchCommand = commandGeneratorService.generateCommand('code', `--user-data-dir '${path.join(rootStoragePath, profileName, 'data')}' --extensions-dir '${path.join(rootStoragePath, profileName, 'extensions')}' -n`)
          await child_process.exec(launchCommand.command, { shell: launchCommand.shell })
        } else {
          await vscode.window.showInformationMessage('Please use a different name. Another profile with the same name already exists, but with different settings.')
        }
      }
    }

    return Promise.resolve()
  })
}
