import * as vscode from 'vscode'
import { default as axios } from 'axios'
import * as path from 'path'
import * as constants from '../constants'
import { CustomProfile } from '../models/custom-profile';

export class FeaturedProfileService {
    async getAll(): Promise<CustomProfile[]> {

        const branchRef = 'feat/featured-profiles'
        const url = `${constants.featuredProfileUrl}?ref=${branchRef}`
        const featuredProfileListResponse = await axios(url)

        const profiles = (featuredProfileListResponse.data as any[])
            .map(item => {
                const profileName = (item.name as string).replace('.json', '')
                const profile = new CustomProfile(
                    `${constants.app}:models.customProfile.${profileName}`,
                    profileName,
                    '',
                    vscode.TreeItemCollapsibleState.None,
                    path.join(__dirname, '..', '..', 'resources', 'github.svg'))

                return profile
            })

        return profiles
    }
}