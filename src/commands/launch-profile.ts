import * as fs from 'fs'
import * as child_process from 'child-process-promise'
import * as vscode from 'vscode'

import {commands, rootStoragePath} from '../constants'
import {CustomProfile} from '../models/custom-profile'
import {Command, CustomProfileDetails} from '../types'

export const launchProfileCommand: Command = {
  name: commands.launchProfile,
  handler: ({service}) => (arg: CustomProfile | {path: string}) => vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Launching Custom Profile',
    cancellable: false
  }, async progress => {
    if (arg instanceof CustomProfile) {
      // Custom profile launch
      const {name} = arg

      if (name === 'default') {
        await child_process.exec('code -n')
      } else {
        const launchCommand = `code --user-data-dir='${rootStoragePath}/${name}/data' --extensions-dir='${rootStoragePath}/${name}/extensions' -n`
        await child_process.exec(launchCommand)
      }
    } else {
      // Custom profile launch from .json file
      // vscode.window.showInformationMessage(arg.path);
      const {path} = arg

      // Check if this profile file has same value as
      // the generated value from profile name;
      if (!fs.existsSync(path)) {
        await vscode.window.showInformationMessage('Unable to find the custom profile details file.')
      }

      const profileDetailsString = await fs.promises.readFile(path, {encoding: 'utf-8'})

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

      // TODO: Check if profile exists
      const profileExists = fs.existsSync(`${rootStoragePath}/${profileName}`)

      if (!profileExists) {
        // Await vscode.window.showInformationMessage('The selected profile does not exist. Creating it now.')

        progress.report({increment: 10, message: 'creating Custom Profile folder...'})
        await fs.promises.mkdir(`${rootStoragePath}/${profileName}`)

        progress.report({increment: 30, message: 'copying Custom Profile user settings...'})
        await child_process.exec(`mkdir -p ${rootStoragePath}/${profileName}/data/User`)

        await fs.promises.writeFile(
          `${rootStoragePath}/${profileName}/data/User/settings.json`,
          JSON.stringify(userSettings, undefined, 2),
          {encoding: 'utf-8'}
        )

        progress.report({increment: 50, message: 'installing extensions...'})

        for (let index = 0; index < extensions.length; index++) {
          const extension = extensions[index]
          await child_process.exec(`code --user-data-dir='${rootStoragePath}/${profileName}/data' --extensions-dir='${rootStoragePath}/${profileName}/extensions' --install-extension ${extension}`)
          progress.report({
            increment: 50 + (((index + 1) / extensions.length) / 50), message: `installing extension '${extension}' (${index + 1}/${extensions.length})...`
          })
        }

        await child_process.exec(`code --user-data-dir='${rootStoragePath}/${profileName}/data' --extensions-dir='${rootStoragePath}/${profileName}/extensions' -n`)
      } else {
        const alreadyPresentJsonString = await service.generateProfileJson(profileName)

        const profileDetailsJsonString = JSON.stringify(profileDetailsJson, undefined, 2)
        if (profileDetailsJsonString === alreadyPresentJsonString) {
          const launchCommand = `code --user-data-dir='${rootStoragePath}/${profileName}/data' --extensions-dir='${rootStoragePath}/${profileName}/extensions' -n`
          await child_process.exec(launchCommand)
        } else {
          await vscode.window.showInformationMessage('Please use a different name. Another profile with the same name already exists, but with different settings.')
        }
      }
    }

    return Promise.resolve()
  })
}
