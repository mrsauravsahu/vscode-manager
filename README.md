# vscode-manager 
![](https://vsmarketplacebadge.apphb.com/version-short/mrsauravsahu.vscode-manager.svg?color=blue&subject=VSCode%20MarketPlace)<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

**Manage multiple VSCode isolated instances with ease 😎**

VSCode Manager helps you manage multiple isolated VSCode instances with separate user settings and extensions. The extension is available on the Marketplace - [Install Now](https://marketplace.visualstudio.com/items?itemName=mrsauravsahu.vscode-manager).

## What's New? 🎉 🥳 - changelog
- **v1.1.0** Bug fix: Launch custom profiles from `.vscode/profile.json`
- **v1.0.0** Add featured profile section to show profiles from Github
- **v0.0.7** Bug fix: Refresh Explorer after a profile is deleted
- **v0.0.6** Create and share custom profile through a `.vscode/profile.json` file
- **v0.0.5** View generated profile details file
- **v0.0.4** Create new isolated profile with default settings

![Screenshot of the VSCode Manager Extension](https://user-images.githubusercontent.com/9134050/123510276-1de74180-d698-11eb-8317-349c092fa6b1.png)


## Coming soon 😎
- Clone profiles

## User Guide

### Installation

You can always install the extension throught the extensions tab inside VSCode - searching for `mrsauravsahu` this should narrow the search results.

### Creating a Custom Profile

- After installing the extension, you should be able to find the sidebar icon. Click to view the `Custom Profiles Explorer`. You will find all your custom profiles here.

![VSCode Manager Extension in the sidebar](https://user-images.githubusercontent.com/9134050/123516881-0457f100-d6bc-11eb-80b3-4e03935fad9b.png)

- Click the `+ New Profile` button to create a custom profile. A new profile with a randomly chosen name will be created.

![Create a new VSCode Custom Profile](https://user-images.githubusercontent.com/9134050/123516879-03bf5a80-d6bc-11eb-87c8-2d949f944206.png)

- You can now `rename` the profile or `launch` it with a right click.

### JSON all the way

- All Custom profiles are represented with a json file. Clicking on any profile in the explorer will show you the schema.

Here's an example: 

![VSCode Json Schema example](https://user-images.githubusercontent.com/9134050/123516877-028e2d80-d6bc-11eb-8f6d-c08e544f3153.png)

### Modifying the custom profile

You can modify all user settings and install extensions within the custom profile once you launch it. 

If you created a new profile, you will be presented with the default launch screen and all settings and extensions will be isolated.

As you make changes to this profile, you'll be able to see changes in the json schema for this profile through the Custom Profiles Explorer.
### Sharing a custom profile among your team
VSCode Manager can also be used to share consistent User Settings and Extensions among your team members.

#### .vscode/profile.json
In your repository, create a `.vscode/profile.json` file, pasting in any custom profile you have created.

#### Use the custom profile
- Open the repository folder with your VSCode. 
- You should see the option to `Launch Custom Profile` when you right click the `.vscode/profile.json` file.

![Launching Custom profiles from .vscode/profile.json](https://user-images.githubusercontent.com/9134050/123516873-fc984c80-d6bb-11eb-8393-a2a732963d1c.png)

#### Updating the profile

Whenever you update the profile and commit to source control, it will go out of sync with others' custom profile. 

You can just delete and the profile from `Custom Profiles Explorer` and launch it again.

Would love your feedback on this. Issues and PRs are welcome. Have a great one! And happy Coding! 😃 \- [Saurav](https://twitter.com/mrsauravsahu)
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://rohinivsenthil.github.io"><img src="https://avatars.githubusercontent.com/u/42040329?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rohini Senthil</b></sub></a><br /><a href="https://github.com/mrsauravsahu/vscode-manager/issues?q=author%3Arohinivsenthil" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!