import * as path from 'path'
import * as vscode from 'vscode'
import axios from 'axios'
import * as constants from '../constants'
import {CustomProfile} from '../models/custom-profile'

export class FeaturedProfileService {
  async getProfileDetails(profile: string): Promise<string> {
    const url = `https://raw.githubusercontent.com/mrsauravsahu/vscode-manager/main/featured/${profile}`
    const featuredProfileListResponse = await axios({url, responseType: 'text'})
    const profileDetails = (featuredProfileListResponse.data)

    if (typeof profileDetails === 'object') {
      return JSON.stringify(profileDetails, undefined, 2)
    }

    return profileDetails as string
  }

  async getAll(): Promise<CustomProfile[]> {
    const branchRef = 'main'
    const url = `${constants.featuredProfileUrl}?ref=${branchRef}`
    let featuredProfileListResponse

    try {
      featuredProfileListResponse = await axios(url)
    } catch {
      // TODO: Show an error message when listing featured profiles fails
      featuredProfileListResponse = {data: []}
    }

    const profiles = (featuredProfileListResponse.data as any[])
      .map((item: {name: string}) => {
        const profileName = (item.name).replace('.json', '')
        const profile = new CustomProfile(
          `${constants.app}:models.customProfile.${profileName}`,
          profileName,
          '',
          vscode.TreeItemCollapsibleState.None,
          path.join(__dirname, '..', '..', 'resources', 'github.svg'))

        profile.command = {
          command: constants.commands.selectFeaturedProfile,
          title: 'Select Featured Profile',
          arguments: [profile],
        }

        return profile
      })

    return profiles
  }
}
